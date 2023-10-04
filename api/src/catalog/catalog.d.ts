/**
 * @file User type declarations.
 */

export type SeasonsType = {
  seasons: {
    season_code: string;
    term: string;
    year: number;
  }[];
};

// type for catalog data
export type CatalogType = {
  computed_listing_info: {
    all_course_codes: string[];
    areas: string[];
    average_gut_rating: number;
    average_professor: number;
    average_rating: number;
    average_workload: number;
    average_rating_same_professors: number;
    average_workload_same_professors: number;
    classnotes: string;
    course_code: string;
    credits: number;
    crn: string;
    description: string;
    enrolled: number;
    extra_info: string;
    final_exam: string;
    flag_info: string;
    fysem: boolean;
    last_enrollment: number;
    last_enrollment_same_professors: number;
    listing_id: string;
    locations_summary: string;
    number: string;
    professor_ids: string[];
    professor_names: string[];
    regnotes: string;
    requirements: string;
    rp_attr: string;
    same_course_id: string;
    same_course_and_profs_id: string;
    last_offered_course_id: string;
    school: string;
    season_code: string;
    section: string;
    skills: string;
    subject: string;
    syllabus_url: string;
    times_by_day: string;
    times_summary: string;
    title: string;
  }[];
};
