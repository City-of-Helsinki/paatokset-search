import React, { useState } from 'react';
import { IconAngleLeft, IconAngleRight } from 'hds-react';
import { ReactiveList } from '@appbaseio/reactivesearch';

import ResultCard from '../components/results/ResultCard';
import SortSelect from '../components/results/SortSelect';
import SizeSelect from '../components/results/SizeSelect';
import { sortBy } from '@appbaseio/reactivesearch/lib/types';

import './ResultsContainer.scss';

const ResultsContainer = () => {
  const [sort, setSort] = useState<sortBy|undefined>('desc');
  const [size, setSize] = useState<number>(10);

  return (
    <div className='ResultsContainer'>
      <ReactiveList
          className='ResultsContainer__container'
          componentId='results'
          size={size}
          pagination={true}
          dataField={'meeting_date'}
          sortBy={sort}
          react={{
              and: ['searchbox', 'DateSensor', 'Category', 'sort-select', 'top_category_name', 'meeting_date']
          }}
          renderResultStats={(stats) => (
            <div className='ResultsContainer__stats'>
              <span className='stats__count'>
                <strong>{stats.numberOfResults}</strong>
                {' hakutulosta'}
              </span>
              <span className='stats__size'>
                <SizeSelect setSize={setSize} />
                {' kpl sivulla'}
              </span>
            </div>
          )}
          renderPagination={({ pages, totalPages, currentPage, setPage, setSize }) => {
            const prevPageExists = currentPage - 1 > 0;
            const nextPageExists = currentPage + 1 <= totalPages;
            const selectPage = Number.isFinite(totalPages) && (
              <div className='ResultsContainer__pagination'>
                <button
                  onClick={() => {
                    if(prevPageExists) {
                      setPage(currentPage - 1)
                    }
                  }}
                  disabled={!prevPageExists}
                  className='pagination__control'
                >
                  <IconAngleLeft />
                </button>
                <span className="pagination__item">
                  {currentPage + 1}
                </span>
                <button 
                  onClick={() => {
                    if(nextPageExists) {
                      setPage(currentPage + 1)
                    }
                  }}
                  className='pagination__control'
                >
                  <IconAngleRight />
                </button>
              </div>
            );
            return selectPage;
          }}
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
