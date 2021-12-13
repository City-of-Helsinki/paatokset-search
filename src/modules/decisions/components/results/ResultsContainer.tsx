import React, { useState } from 'react';
import { IconAngleLeft, IconAngleRight } from 'hds-react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import { useTranslation } from 'react-i18next';

import ResultCard from './ResultCard';
import SortSelect from './SortSelect';
import SizeSelect from './SizeSelect';
import { sortBy } from '@appbaseio/reactivesearch/lib/types';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';

import './ResultsContainer.scss';

const ResultsContainer = () => {
  const [sort, setSort] = useState<sortBy|undefined>('desc');
  const [size, setSize] = useState<number>(12);
  const { t } = useTranslation();

  const getPagination = (current: number, pages: number, totalPages: number) => {
    const pagesPerSide = (pages - 1) / 2;
    let pagesLeft = pagesPerSide * 2;
    let prevPages: Array<number> = [];
    let nextPages: Array<number> = [];

    if(pagesPerSide > 0) {
      for(let i = current - 1; prevPages.length < pagesPerSide && i >= 0; i--) {
        prevPages.push(i);
        pagesLeft--;
      }

      for(let i = current + 1; (pagesLeft > 0 && i < totalPages); i++) {
        nextPages.push(i);
        pagesLeft--;
      }
    }

    prevPages.reverse();

    return {
      prevPages,
      nextPages
    };
  }

  const { width } = useWindowDimensions();

  const pages = width < 768 ? 1 : 5;

  return (
    <div className='ResultsContainer'>
      <ReactiveList
          className='ResultsContainer__container'
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
            <div className='ResultsContainer__stats'>
              <span className='stats__count'>
                <strong>{stats.numberOfResults}</strong>
                {t('SEARCH:results-count')}
              </span>
              <span className='stats__size'>
                <SizeSelect setSize={setSize} />
                {t('SEARCH:per-page')}
              </span>
            </div>
          )}
          renderPagination={({ pages, totalPages, currentPage, setPage, setSize }) => {
            const { prevPages, nextPages } = getPagination(currentPage, pages, totalPages)
            const prevPageExists = currentPage - 1 >= 0;
            const nextPageExists = currentPage + 1 < totalPages;
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
                {prevPages.map(pageIndex => (
                  <button
                    className='pagination__item'
                    onClick={() => setPage(pageIndex)}
                    key={pageIndex}
                  >
                    { pageIndex + 1 }
                  </button>
                ))}
                <button className="pagination__item pagination__item--current">
                  {currentPage + 1}
                </button>
                {nextPages.map(pageIndex => (
                  <button
                    className='pagination__item'
                    onClick={() => setPage(pageIndex)}
                    key={pageIndex}
                  >
                    { pageIndex + 1 }
                  </button>
                ))}
                <button 
                  onClick={() => {
                    if(nextPageExists) {
                      setPage(currentPage + 1)
                    }
                  }}
                  disabled={!nextPageExists}
                  className='pagination__control'
                >
                  <IconAngleRight />
                </button>
              </div>
            );
            return selectPage;
          }}
          renderNoResults={() => (
            <div className='ResultsContainer__stats'>
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
