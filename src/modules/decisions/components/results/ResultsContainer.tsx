import React, { useState } from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { useTranslation } from 'react-i18next';
import { sortBy } from '@appbaseio/reactivesearch/lib/types';

import ResultCard from './ResultCard';
import SortSelect from './SortSelect';
import SizeSelect from './SizeSelect';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import Pagination from '../../../../common/components/results/Pagination';

import resultsStyles from '../../../../common/styles/Results.module.scss';

const ResultsContainer = () => {
  const [sort, setSort] = useState<sortBy|undefined>('desc');
  const [size, setSize] = useState<number>(12);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const pages = width < 768 ? 1 : 5;

  return (
    <div className={resultsStyles.ResultsContainer}>
      <ReactiveList
          className={resultsStyles.ResultsContainer__container}
          componentId={SearchComponents.RESULTS}
          size={size}
          pagination={true}
          pages={pages}
          dataField={IndexFields.MEETING_DATE}
          sortBy={sort}
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
              <span className='stats__count'>
                <strong>0</strong>
                {t('SEARCH:results-count')}
              </span>
            </div>
          )}
          render={({ data }) => (
            <React.Fragment>
            <SortSelect
              setSort={setSort}
            />
            <ReactiveList.ResultCardsWrapper
              style={{
                margin: 0,
                gap: '24px'
              }}
            >
              {data.map((item: any) => {
                const {id} = item;
                const resultProps = {
                  category: item.top_category_name,
                  date: item.meeting_date,
                  href: item.meeting_policymaker_link,
                  policymaker: 'Kaupunginvaltuusto',
                  subject: item.subject
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
