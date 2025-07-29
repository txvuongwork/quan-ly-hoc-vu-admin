import { useGetAllMajors } from "@/api/majorApi";
import { useGetAllSemesters } from "@/api/semesterApi";
import { useGetAllSubjects } from "@/api/subjectApi";
import { useGetAllTeachers } from "@/api/useApi";
import type { IResponse, TMajor, TSemester, TSubject, TUser } from "@/types";
import type { UseQueryResult } from "@tanstack/react-query";

// Define available data keys
export type CommonDataKey = "majors" | "teachers" | "semesters" | "subjects";

// Define the mapping between keys and their corresponding data types
export interface CommonDataMapping {
  majors: TMajor[];
  teachers: TUser[];
  semesters: TSemester[];
  subjects: TSubject[];
}

// Define the return type for each query
export interface CommonQueryMapping {
  majors: UseQueryResult<IResponse<TMajor[]>, Error>;
  teachers: UseQueryResult<IResponse<TUser[]>, Error>;
  semesters: UseQueryResult<IResponse<TSemester[]>, Error>;
  subjects: UseQueryResult<IResponse<TSubject[]>, Error>;
}

// Define the result type based on requested keys
export type UseCommonDataResult<T extends CommonDataKey[]> = {
  [K in T[number]]: {
    data: CommonDataMapping[K];
    isFetching: boolean;
    query: CommonQueryMapping[K];
  };
} & {
  isAnyFetching: boolean;
  isAllFetching: boolean;
};

// Hook implementation
export function useCommonData<T extends CommonDataKey[]>(
  keys: T
): UseCommonDataResult<T> {
  // Call all hooks but only enable the ones that are requested
  const majorsQuery = useGetAllMajors(keys.includes("majors"));
  const teachersQuery = useGetAllTeachers(keys.includes("teachers"));
  const semestersQuery = useGetAllSemesters(keys.includes("semesters"));
  const subjectsQuery = useGetAllSubjects(keys.includes("subjects"));

  // Create the mapping of all available data
  const dataQueries = {
    majors: {
      data: majorsQuery.data?.ok ? majorsQuery.data.body : [],
      isFetching: majorsQuery.isFetching,
      query: majorsQuery,
    },
    teachers: {
      data: teachersQuery.data?.ok ? teachersQuery.data.body : [],
      isFetching: teachersQuery.isFetching,
      query: teachersQuery,
    },
    semesters: {
      data: semestersQuery.data?.ok ? semestersQuery.data.body : [],
      isFetching: semestersQuery.isFetching,
      query: semestersQuery,
    },
    subjects: {
      data: subjectsQuery.data?.ok ? subjectsQuery.data.body : [],
      isFetching: subjectsQuery.isFetching,
      query: subjectsQuery,
    },
  } as const;

  // Create a properly typed result using Object.fromEntries (cleaner approach)
  type ResultAccumulator<K extends CommonDataKey[]> = {
    [P in K[number]]: {
      data: CommonDataMapping[P];
      isFetching: boolean;
      query: CommonQueryMapping[P];
    };
  };

  // Use Object.fromEntries for better type safety
  const result = Object.fromEntries(
    keys.map((key) => [key, dataQueries[key]])
  ) as ResultAccumulator<T>;

  // Calculate loading states
  const requestedQueries = keys.map((key) => dataQueries[key]);
  const isAnyFetching = requestedQueries.some((query) => query.isFetching);
  const isAllFetching = requestedQueries.every((query) => query.isFetching);

  return {
    ...result,
    isAnyFetching,
    isAllFetching,
  } as UseCommonDataResult<T>;
}
