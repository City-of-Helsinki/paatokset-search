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
import PhantomCard from './PhantomCard';

import resultsStyles from '../../../../common/styles/Results.module.scss';
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

  const dataField = sort === Sort.SCORE ? IndexFields.SCORE : IndexFields.MEETING_DATE;
  const sortBy = (sort === Sort.SCORE || sort === Sort.DATE_DESC) ? 'desc' : 'asc'; 

  return (
    <div className={resultsStyles.ResultsContainer} ref={resultsContainer}>
      <ReactiveList
          className={classNames(
            resultsStyles.ResultsContainer__container,
            'container'
          )}
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
                style={cardWrapperStyles}
              >
                {data.map((item: any) => {
                  const {id} = item;
                  const resultProps = {
                    category: item.top_category_name,
                    color_class: item.color_class,
                    organization_name: item.organization_name,
                    date: item.meeting_date,
                    href: item.decision_url,
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
