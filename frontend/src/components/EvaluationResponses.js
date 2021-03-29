import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
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

/**
 * Displays Evaluation Comments
 * @prop crn - integer that holds current listing's crn
 * @prop info - dictionary that holds the eval data for each question
 */

const EvaluationResponses = ({ crn, info }) => {
  // Sort by original order or length?
  const [sort_order, setSortOrder] = useState('original');

  // Hooks for filtering evaluations in the searchbar
  const [data, setData] = useState([]);
  const [dataDefault, setDataDefault] = useState([]);
  const [dataDefault2, setDataDefault2] = useState([]);
  const [keyword, setKeyword] = useState('');

  const sortByLength = useCallback((responses) => {
    for (const key in responses) {
      responses[key].sort(function (a, b) {
        return b.length - a.length;
      });
    }
    return responses;
  }, []);

  // Used to sort frequency of adjectives in each evaluation
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

  const summarize_comments = useRef(null);
  const recommend_comments = useRef(null);
  const skills_comments = useRef(null);
  const strengths_comments = useRef(null);

  useEffect(() => {
    const summarize_arr = [];
    const recommend_arr = [];
    const skills_arr = [];
    const strengths_arr = [];
    const firstRender = () => {
      info.forEach((section) => {
        const crn_code = section.crn;
        // Only fetch comments for this section
        if (crn_code !== crn) return;
        const { nodes } = section.course.evaluation_narratives_aggregate;
        // Return if no comments
        if (!nodes.length) return;
        // Add comments to responses dictionary
        nodes.forEach((node) => {
          if (node.evaluation_question.question_text.includes('summarize')) {
            summarize_arr.push(node.comment);
          }
          if (node.evaluation_question.question_text.includes('recommend')) {
            recommend_arr.push(node.comment);
          }
          if (node.evaluation_question.question_text.includes('skills')) {
            skills_arr.push(node.comment);
          }
          if (node.evaluation_question.question_text.includes('strengths')) {
            strengths_arr.push(node.comment);
          }
        });
      });
    };
    firstRender();
    summarize_comments.current = summarize_arr;
    recommend_comments.current = recommend_arr;
    skills_comments.current = skills_arr;
    strengths_comments.current = strengths_arr;
    // Save comments to display and filter
    setData(recommend_arr);
    setDataDefault(recommend_arr);
    setDataDefault2(recommend_arr);
  }, [crn, info]);

  // Dictionary that holds the comments for each question
  const [responses, sorted_responses] = useMemo(() => {
    const temp_responses = {};
    // Loop through each section for this course code
    info.forEach((section) => {
      const crn_code = section.crn;
      // Only fetch comments for this section
      if (crn_code !== crn) return;
      const { nodes } = section.course.evaluation_narratives_aggregate;
      // Return if no comments
      if (!nodes.length) return;
      // Add comments to responses dictionary
      nodes.forEach((node) => {
        if (!temp_responses[node.evaluation_question.question_text])
          temp_responses[node.evaluation_question.question_text] = [];
        temp_responses[node.evaluation_question.question_text].push(
          node.comment
        );
      });
    });
    return [
      temp_responses,
      sortByLength(JSON.parse(JSON.stringify(temp_responses))), // Deep copy temp_responses and sort it
    ];
  }, [info, sortByLength, crn]);

  // Number of questions
  const num_questions = Object.keys(responses).length;

  // Generate HTML to hold the responses to each question
  const [recommend, skills, strengths, summary] = useMemo(() => {
    // Lists that hold the html for the comments for a specific question
    let temp_recommend = [];
    let temp_skills = [];
    let temp_strengths = [];
    let temp_summary = [];
    const cur_responses =
      sort_order === 'length' ? sorted_responses : responses;
    // Populate the lists above
    for (const key in cur_responses) {
      if (key.includes('summarize')) {
        temp_summary = data.map((response) => {
          return (
            <StyledCommentRow key={response} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('recommend')) {
        temp_recommend = data.map((response) => {
          return (
            <StyledCommentRow key={response} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('skills')) {
        temp_skills = data.map((response) => {
          return (
            <StyledCommentRow key={response} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      } else if (key.includes('strengths')) {
        temp_strengths = data.map((response) => {
          return (
            <StyledCommentRow key={response} className="m-auto p-2">
              <TextComponent type={1}>{response}</TextComponent>
            </StyledCommentRow>
          );
        });
      }
    }
    return [temp_recommend, temp_skills, temp_strengths, temp_summary];
  }, [responses, sort_order, sorted_responses, data]);

  // Hook to filter evaluations based on search term
  useEffect(() => {
    const updateKeyword = (word) => {
      const filtered = dataDefault.filter((x) => {
        return x.toLowerCase().includes(word.toLowerCase());
      });
      setData(filtered);
    };
    updateKeyword(keyword);
  }, [dataDefault, keyword]);

  const popular_adjectives = useRef(null);
  useEffect(() => {
    const adjectives = [];
    const getEvals = () => {
      // Get all the adjectives from every evaluation in the current panel selection
      for (let i = 0; i < dataDefault2.length; i++) {
        const sentence = tagger.tag(tokenizer.tokenize(dataDefault2[i]));
        for (let j = 0; j < sentence.taggedWords.length; j++) {
          if (sentence.taggedWords[j].tag === 'JJ') {
            adjectives.push(sentence.taggedWords[j].token);
          }
        }
      }
    };
    getEvals();
    popular_adjectives.current = sortByFrequency(adjectives).slice(0, 15);
  }, [dataDefault2]);

  return (
    <div>
      <Row className={`${styles.sort_by} mx-auto mb-2 justify-content-center`}>
        <span className="font-weight-bold my-auto mr-2">Sort by:</span>
        <div className={styles.sort_options}>
          <StyledSortOption
            active={sort_order === 'original'}
            onClick={() => setSortOrder('original')}
          >
            original
          </StyledSortOption>
          <StyledSortOption
            active={sort_order === 'length'}
            onClick={() => setSortOrder('length')}
          >
            length
          </StyledSortOption>
          <StyledSortOption
            active={sort_order === 'positive'}
            onClick={() => setSortOrder('positive')}
          >
            positive
          </StyledSortOption>
          <StyledSortOption
            active={sort_order === 'negative'}
            onClick={() => setSortOrder('negative')}
          >
            negative
          </StyledSortOption>
        </div>
      </Row>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          width="100%"
          autoComplete="off"
          placeholder="Search for..."
          name="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
          overflow: 'hidden',
          maxHeight: '3.6em',
          lineHeight: '1.8em',
          marginBottom: '2px',
        }}
      >
        {popular_adjectives.current?.map((x) => (
          <div
            key={x}
            style={{
              color: evalsColormap(analyzer.getSentiment([x]))
                .darken()
                .saturate(),
              marginLeft: '5px',
              marginRight: '5px',
            }}
          >
            {x}
          </div>
        ))}
      </div>
      <StyledTabs
        variant="tabs"
        transition={false}
        onSelect={(k) => {
          if (k === 'recommended') {
            setData(recommend_comments.current);
            setDataDefault(recommend_comments.current);
            setDataDefault2(recommend_comments.current);
          }
          if (k === 'knowledge/skills') {
            setData(skills_comments.current);
            setDataDefault(skills_comments.current);
            setDataDefault2(skills_comments.current);
          }
          if (k === 'strengths/weaknesses') {
            setData(strengths_comments.current);
            setDataDefault(strengths_comments.current);
            setDataDefault2(strengths_comments.current);
          }
          if (k === 'summary') {
            setData(summarize_comments.current);
            setDataDefault(summarize_comments.current);
            setDataDefault2(summarize_comments.current);
          }
        }}
      >
        {/* Recommend Question */}
        <Tab eventKey="recommended" title="Recommend?">
          {recommend.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  Would you recommend this course to another student? Please
                  explain.
                </TextComponent>
              </Row>
              {recommend}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Knowledge/Skills Question */}
        <Tab eventKey="knowledge/skills" title="Skills">
          {skills.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  What knowledge, skills, and insights did you develop by taking
                  this course?
                </TextComponent>
              </Row>
              {skills}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Strengths/Weaknesses Question */}
        <Tab eventKey="strengths/weaknesses" title="Strengths/Weaknesses">
          {strengths.length !== 0 ? (
            <div>
              <Row className={`${styles.question_header} m-auto pt-2`}>
                <TextComponent type={0}>
                  What are the strengths and weaknesses of this course and how
                  could it be improved?
                </TextComponent>
              </Row>
              {strengths}
            </div>
          ) : (
            'No results'
          )}
        </Tab>
        {/* Summarize Question */}
        {!recommend && !skills && !strengths && (
          <Tab eventKey="summary" title="Summary">
            {summary.length !== 0 ? (
              <div>
                <Row className={`${styles.question_header} m-auto pt-2`}>
                  <TextComponent type={0}>
                    How would you summarize this course? Would you recommend it
                    to another student? Why or why not?
                  </TextComponent>
                </Row>
                {summary}
              </div>
            ) : (
              'No results'
            )}
          </Tab>
        )}
      </StyledTabs>
      {!num_questions && <strong>No comments for this course</strong>}
    </div>
  );
};

export default EvaluationResponses;
