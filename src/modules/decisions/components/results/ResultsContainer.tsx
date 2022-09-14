import React, { useRef, useState } from 'react';
import { ReactiveList, StateProvider } from '@appbaseio/reactivesearch';
import { useTranslation } from 'react-i18next';

import ResultCard from './ResultCard';
import SortSelect from './SortSelect';
import SizeSelect from './SizeSelect';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import { Sort } from '../../enum/Sort';
import Pagination from '../../../../common/components/results/PaginationBundled';
import PhantomCard from './PhantomCard';

import resultsStyles from '../../../../common/styles/Results.module.scss';
import styles from './ResultsContainer.module.scss';
import classNames from 'classnames';

const ResultsContainer = () => {
  const [sort, setSort] = useState<string|undefined>(Sort.SCORE);
  const [size, setSize] = useState<number>(12);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const resultsContainer = useRef<HTMLDivElement|null>(null);

  const pages = width < 768 ? 3 : 5;
  const scrollToResults = () => {
    if(resultsContainer.current) {
      resultsContainer.current.scrollIntoView();
    }
  }

  const cardWrapperStyles: any = {
    margin: 0,
    gap: '24px',
    width: '100%'
  };
  if(width > 1281) {
    cardWrapperStyles.justifyContent = 'space-between'
  }

  const getRealResultsAmount = (searchState:any) => {
    console.log(searchState);
    if (!searchState.results) {
      return 0;
    }
    if (searchState.results.aggregations && searchState.results.aggregations.issue_id && searchState.results.aggregations.issue_id.buckets.length > 0) {
      return searchState.results.aggregations.issue_id.buckets.length;
    }
    return searchState.results.hits.total;
  }

  const dataField = sort === Sort.SCORE ? IndexFields.SCORE : IndexFields.MEETING_DATE;
  const sortBy = (sort === Sort.SCORE || sort === Sort.DATE_DESC) ? 'desc' : 'asc';
  const customQuery = () => {
    return {
      query: {
        function_score: {
          boost: 10,
          query: {
            bool: {
              should: [
                {"match": {"_language": t('SEARCH:langcode')}},
                {"match": {"has_translation": false}}
              ]
            }
          },
          functions: [
            {gauss:
              {
                meeting_date: {
                  scale: '365d'
                }
              }
            }
          ]
        }
      },
      aggs: {
        [IndexFields.ISSUE_ID]: {
          terms: {
            field: IndexFields.ISSUE_ID,
            size: 10000,
            show_term_doc_count_error: true
          }
        }
      },
      collapse: {
        field: "issue_id"
      }
    }
  };

  return (
    <div className={resultsStyles.ResultsContainer} ref={resultsContainer}>
      <ReactiveList
          className={classNames(
            resultsStyles.ResultsContainer__container,
            styles.ResultsContainer__container,
            'container'
          )}
          onQueryChange={
            function(prevQuery, nextQuery) {
              const query = customQuery();
              if (typeof nextQuery.aggs === "undefined") {
                nextQuery.aggs = query.aggs;
              }
              if (typeof nextQuery.collapse === "undefined") {
                nextQuery.collapse = query.collapse;
              }
            }
          }
          componentId={SearchComponents.RESULTS}
          size={size}
          pagination={true}
          pages={pages}
          dataField={dataField}
          sortBy={sortBy}
          onPageChange={scrollToResults}
          URLParams={true}
          react={{
              or: [
                SearchComponents.SEARCH_BAR,
                SearchComponents.WILDCARD
              ],
              and: [
                SearchComponents.CATEGORY,
                SearchComponents.MEETING_DATE,
                SearchComponents.DM
              ]
          }}
          renderResultStats={(stats) => (
            <StateProvider includeKeys={['aggregations', 'hits']} render={({ searchState }) => (
              <div className={resultsStyles.ResultsContainer__stats}>
                <span className={resultsStyles.stats__count}>
                  <strong>{getRealResultsAmount(searchState)}</strong>
                  {t('SEARCH:results-count')}
                </span>
                <span className={resultsStyles.stats__size}>
                  <SizeSelect setSize={setSize} />
                  {t('SEARCH:per-page')}
                </span>
              </div>
            )} />
          )}
          renderPagination={({ pages, totalPages, currentPage, setPage, setSize }) => (
            <StateProvider includeKeys={['aggregations', 'hits']} render={({ searchState }) => (
              <Pagination
                pages={pages}
                totalPages={totalPages}
                currentPage={currentPage}
                setPage={setPage}
                size={size}
                searchState={searchState}
              />
            )} />
          )}
          renderNoResults={() => (
            <div className={resultsStyles.ResultsContainer__stats}>
              <span className={resultsStyles.stats__count}>
                <strong>0</strong>
                {t('SEARCH:results-count')}
              </span>
            </div>
          )}
          defaultQuery={customQuery}
          render={({ data, rawData }) => (
            <React.Fragment>
              <SortSelect
                setSort={setSort}
              />
              <ReactiveList.ResultCardsWrapper
                style={cardWrapperStyles}
              >
                {
                  data.map((item: any) => {

                  // Item mapping.
                  const {id} = item;
                  // Check document count for collapsed search results.
                  const aggregations = rawData.aggregations;
                  let doc_count = 1;

                  if (item.issue_id && item.issue_id[0] && aggregations && aggregations.issue_id && aggregations.issue_id.buckets.length) {
                    const buckets = aggregations.issue_id.buckets;
                    for (let i = 0; i < buckets.length; i++) {
                      if (buckets[i].key === item.issue_id[0]) {
                        doc_count = buckets[i].doc_count;
                      }
                    }
                  }

                  const resultProps = {
                    category: item.top_category_name,
                    color_class: item.color_class,
                    organization_name: item.organization_name,
                    date: item.meeting_date,
                    href: item.decision_url,
                    lang_prefix: t('SEARCH:prefix'),
                    url_prefix: t('DECISIONS:url-prefix'),
                    url_query: t('DECISIONS:url-query'),
                    amount_label: t('DECISIONS:amount-label'),
                    issue_id: item.issue_id,
                    doc_count: doc_count,
                    policymaker: '',
                    subject: item.subject,
                    _score: item._score
                  };
                  return <ResultCard
                    key={id}
                    {...resultProps}
                  />
                })}
                {data.length % 3 !== 0 &&
                  <PhantomCard />
                }
              </ReactiveList.ResultCardsWrapper>
            </React.Fragment>
          )}
      />
      </div>
  );
};

export default ResultsContainer;
