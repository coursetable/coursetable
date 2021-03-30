import React, { useState, useEffect, useMemo } from 'react';
import { Tab, Row, Tabs } from 'react-bootstrap';
import styled from 'styled-components';
import natural from 'natural';

import styles from './EvaluationResponses.module.css';
import { TextComponent } from './StyledComponents';
import { evalsColormap } from '../queries/Constants';

// Set up parameters for natural
const language = 'EN';
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';
const lexicon = new natural.Lexicon(
  language,
  defaultCategory,
  defaultCategoryCapitalized
);
const ruleSet = new natural.RuleSet('EN');
const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

// Natural's tokenizer (same as split in javascript)
const tokenizer = new natural.WordTokenizer();

// Natural's sentiment analysis
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer('English', stemmer, 'senticon');

// Tabs of evaluation comments in modal
const StyledTabs = styled(Tabs)`
  background-color: ${({ theme }) => theme.surface[0]};
  font-weight: 500;
  position: sticky;
  top: -1rem;
  .active {
    background-color: ${({ theme }) => `${theme.surface[0]} !important`};
    color: #468ff2 !important;
    border-bottom: none;
  }
  .nav-item {
    color: ${({ theme }) => theme.text[0]};
  }
  .nav-item:hover {
    background-color: ${({ theme }) => theme.banner};
    color: ${({ theme }) => theme.text[0]};
  }
`;

// Row for each comment
const StyledCommentRow = styled(Row)`
  font-size: 14px;
  font-weight: 450;
  border-bottom: 1px solid ${({ theme }) => theme.multivalue};
`;

// Bubble to choose sort order
const StyledSortOption = styled.span`
  padding: 3px 5px;
  background-color: ${({ theme, active }) =>
    active ? 'rgba(92, 168, 250,0.5)' : theme.border};
  color: ${({ theme, active }) => (active ? theme.text[0] : theme.text[2])};
  font-weight: 500;
  &:hover {
    background-color: ${({ theme, active }) =>
      active ? 'rgba(92, 168, 250,0.5)' : theme.multivalue};
    cursor: pointer;
  }
`;

// Section for keyword suggestions
const StyledSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
  margin-bottom: 2px;
`;

// Styling for suggested words
const SuggestedWord = styled.div`
  color: ${({ word }) =>
    evalsColormap(analyzer.getSentiment([word]))
      .darken()
      .saturate()};
  margin-left: 5px;
  margin-right: 5px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

/**
 * Displays Evaluation Comments
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

const EvaluationResponses = ({ crn, info }) => {
  // Keep track of user sort, search, and panel selections
  const [sortOrder, setSortOrder] = useState('original');
  const [curPanel, setCurPanel] = useState('recommended');
  const [keyword, setKeyword] = useState('');

  // Keep track of sorted/filtered/suggested data
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [dataSort, setDataSort] = useState([]);
  const [dataDependent, setDataDependent] = useState([]);

  // Function to sort frequency of adjectives in each evaluation
  const sortByFrequency = (array) => {
    const frequency = {};
    array.forEach((value) => {
      frequency[value] = 0;
    });
    const uniques = array.filter((value) => {
      return ++frequency[value] === 1;
    });
    return uniques.sort((a, b) => {
      return frequency[b] - frequency[a];
    });
  };

  // Create the lists of relevant comments for the each panel
  const [
    summarizeComments,
    recommendComments,
    skillsComments,
    strengthsComments,
  ] = useMemo(() => {
    const summarizeList = [];
    const recommendList = [];
    const skillsList = [];
    const strengthsList = [];
    info.forEach((section) => {
      const crn_code = section.crn;
      // Only fetch comments for this section
      if (crn_code !== crn) return;
      const { nodes } = section.course.evaluation_narratives_aggregate;
      // Return if no comments
      if (!nodes.length) return;
      // Add comments to relevant list
      nodes.forEach(({ comment, evaluation_question }) => {
        Object.entries({
          summarize: summarizeList,
          recommend: recommendList,
          skills: skillsList,
          strengths: strengthsList,
        }).forEach(
          ([k, v]) =>
            evaluation_question.question_text.includes(k) && v.push(comment)
        );
      });
    });
    // Save comments
    [setData, setDataSearch, setDataSort, setDataDependent].forEach((fn) =>
      fn(recommendList)
    );
    return [summarizeList, recommendList, skillsList, strengthsList];
  }, [crn, info]);

  // Generate JSX to display all the evaluations from data
  const [evals] = useMemo(() => {
    const display = data.map((response) => {
      return (
        <StyledCommentRow key={response} className="m-auto p-2">
          <TextComponent type={1}>{response}</TextComponent>
        </StyledCommentRow>
      );
    });
    return [display];
  }, [data]);

  // SORT -- Hook to determine which evaluations to show based on sort
  useEffect(() => {
    const arr = keyword === '' ? dataSort : dataDependent;
    if (sortOrder === 'original') setData(arr);
    if (sortOrder === 'length')
      setData([...arr].sort((a, b) => b.length - a.length));
    if (sortOrder === 'positive')
      setData(
        [...arr]
          .map((x) => [x, analyzer.getSentiment(tokenizer.tokenize(x))])
          .sort(([a, b], [c, d]) => d - b || a - c)
          .map((a) => a[0])
          .flat(1)
      );
    if (sortOrder === 'negative')
      setData(
        [...arr]
          .map((x) => [x, analyzer.getSentiment(tokenizer.tokenize(x))])
          .sort(([a, b], [c, d]) => b - d || c - a)
          .map((a) => a[0])
          .flat(1)
      );
  }, [dataDependent, dataSort, keyword, sortOrder]);

  // SEARCH -- Hook to filter evaluations based on search
  useEffect(() => {
    const updateKeyword = (word) => {
      const filtered = dataSearch.filter((x) => {
        return x.toLowerCase().includes(word.toLowerCase());
      });
      setData(filtered);
      setDataDependent(filtered);
    };
    updateKeyword(keyword);
  }, [dataSearch, keyword]);

  // SUGGESTIONS -- Hook to gather suggestions based on current panel
  const [suggestions] = useMemo(() => {
    let adjectives = [];
    let verbs = [];
    let popularWords = [];
    // Get every suggestion from evaluations in the current panel selection
    dataSort.forEach((d) => {
      const { taggedWords } = tagger.tag(tokenizer.tokenize(d));
      verbs = [
        ...verbs,
        ...taggedWords
          .filter((w) => ['VB', 'VBP', 'VBD'].includes(w.tag))
          .map((w) => w.token),
      ];
      adjectives = [
        ...adjectives,
        ...taggedWords.filter((w) => w.tag === 'JJ').map((w) => w.token),
      ];
    });
    // Suggestions are adjectives for every panel except the skill panel
    if (curPanel === 'knowledge/skills') {
      popularWords = sortByFrequency(verbs).slice(0, 15);
    } else {
      popularWords = sortByFrequency(adjectives).slice(0, 15);
    }
    return [popularWords];
  }, [curPanel, dataSort]);

  // Component for cleaner render of sort options, can also apply to tabs
  const SortOption = ({ sortby }) => {
    return (
      <StyledSortOption
        active={sortOrder === sortby}
        onClick={() => setSortOrder(sortby)}
      >
        {sortby}
      </StyledSortOption>
    );
  };

  return (
    <>
      {/* Selections for sorting */}
      <Row className={`${styles.sort_by} mx-auto mb-2 justify-content-center`}>
        <span className="font-weight-bold my-auto mr-2">Sort by:</span>
        <div className={styles.sort_options}>
          <SortOption sortby="original" />
          <SortOption sortby="length" />
          <SortOption sortby="positive" />
          <SortOption sortby="negative" />
        </div>
      </Row>
      {/* Selections for searching */}
      <div className="input-group">
        <input
          type="text"
          className="form-control shadow-none"
          width="100%"
          autoComplete="off"
          placeholder="Search for..."
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          type="button"
          className="btn bg-transparent shadow-none"
          style={{ marginLeft: '-40px', zIndex: '100' }}
          onClick={() => setKeyword('')}
        >
          X
        </button>
      </div>
      {/* Selections for suggested words */}
      <StyledSuggestions>
        {suggestions?.map((x) => (
          <SuggestedWord key={x} word={x} onClick={() => setKeyword(x)}>
            {x}
          </SuggestedWord>
        ))}
      </StyledSuggestions>
      {/* Selections for panels */}
      <StyledTabs
        variant="tabs"
        transition={false}
        onSelect={(k) => {
          setKeyword('');
          setCurPanel(k);
          const d = {
            recommended: recommendComments,
            'knowledge/skills': skillsComments,
            'strengths/weaknesses': strengthsComments,
            summary: summarizeComments,
          };
          setDataSearch(d[k]);
          setDataSort(d[k]);
        }}
      >
        {/* Recommend Question */}
        <Tab eventKey="recommended" title="Recommend?">
          {evals.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  Would you recommend this course to another student? Please
                  explain.
                </TextComponent>
              </Row>
              {evals}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Knowledge/Skills Question */}
        <Tab eventKey="knowledge/skills" title="Skills">
          {evals.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  What knowledge, skills, and insights did you develop by taking
                  this course?
                </TextComponent>
              </Row>
              {evals}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Strengths/Weaknesses Question */}
        <Tab eventKey="strengths/weaknesses" title="Strengths/Weaknesses">
          {evals.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  What are the strengths and weaknesses of this course and how
                  could it be improved?
                </TextComponent>
              </Row>
              {evals}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Summarize Question */}
        {!recommendComments && !skillsComments && !strengthsComments && (
          <Tab eventKey="summary" title="Summary">
            {evals.length !== 0 ? (
              <div>
                <Row className={`${styles.question_header} m-auto pt-2`}>
                  <TextComponent type={0}>
                    How would you summarize this course? Would you recommend it
                    to another student? Why or why not?
                  </TextComponent>
                </Row>
                {evals}
              </div>
            ) : (
              'No results'
            )}
          </Tab>
        )}
      </StyledTabs>
    </>
  );
};

export default EvaluationResponses;
