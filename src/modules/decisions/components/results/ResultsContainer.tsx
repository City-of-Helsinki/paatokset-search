import React, { useRef, useState } from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { useTranslation } from 'react-i18next';

import ResultCard from './ResultCard';
import SortSelect from './SortSelect';
import SizeSelect from './SizeSelect';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import { Sort } from '../../enum/Sort';
import Pagination from '../../../../common/components/results/Pagination';

import resultsStyles from '../../../../common/styles/Results.module.scss';

const ResultsContainer = () => {
  const [sort, setSort] = useState<string|undefined>(Sort.SCORE);
  const [size, setSize] = useState<number>(12);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const resultsContainer = useRef<HTMLDivElement|null>(null);

  const pages = width < 768 ? 1 : 5;
  const scrollToResults = () => {
    if(resultsContainer.current) {
      resultsContainer.current.scrollIntoView();
    }
  }

  const dataField = sort === Sort.SCORE ? IndexFields.SCORE : IndexFields.MEETING_DATE;
  const sortBy = (sort === Sort.SCORE || sort === Sort.DATE_DESC) ? 'desc' : 'asc'; 

  return (
    <div className={resultsStyles.ResultsContainer} ref={resultsContainer}>
      <ReactiveList
          className={resultsStyles.ResultsContainer__container}
          componentId={SearchComponents.RESULTS}
          size={size}
          pagination={true}
          pages={pages}
          dataField={dataField}
          sortBy={sortBy}
          onPageChange={scrollToResults}
          URLParams={true}
          react={{
              and: [
                SearchComponents.SEARCH_BAR,
                SearchComponents.CATEGORY,
                SearchComponents.MEETING_DATE
              ]
          }}
          renderResultStats={(stats) => (
            <div className={resultsStyles.ResultsContainer__stats}>
              <span className={resultsStyles.stats__count}>
                <strong>{stats.numberOfResults}</strong>
                {t('SEARCH:results-count')}
              </span>
              <span className={resultsStyles.stats__size}>
                <SizeSelect setSize={setSize} />
                {t('SEARCH:per-page')}
              </span>
            </div>
          )}
          renderPagination={({ pages, totalPages, currentPage, setPage, setSize }) => (
            <Pagination
              pages={pages}
              totalPages={totalPages}
              currentPage={currentPage}
              setPage={setPage}
              setSize={setSize}
            />
          )}
          renderNoResults={() => (
            <div className={resultsStyles.ResultsContainer__stats}>
              <span className={resultsStyles.stats__count}>
                <strong>0</strong>
                {t('SEARCH:results-count')}
              </span>
            </div>
          )}
          defaultQuery={(value, props) => {
            return {
              query: {
                function_score: {
                  boost: 10,
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
              }
            }
          }}
          render={({ data }) => (
            <React.Fragment>
              <SortSelect
                setSort={setSort}
              />
              <ReactiveList.ResultCardsWrapper
                style={{
                  margin: 0,
                  gap: '24px',
                  width: '100%'
                }}
              >
                {data.map((item: any) => {
                  const {id} = item;
                  const resultProps = {
                    category: item.top_category_name,
                    color_class: item.color_class,
                    date: item.meeting_date,
                    href: item.decision_url,
                    policymaker: 'Kaupunginvaltuusto',
                    subject: item.subject,
                    _score: item._score
                  };
                  return <ResultCard
                    key={id}
                    {...resultProps}
                  />
                })}
              </ReactiveList.ResultCardsWrapper>
            </React.Fragment>
          )}
      />
      </div>
  );
};

export default ResultsContainer;
