import { ReactiveList } from '@appbaseio/reactivesearch';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import SearchComponents from '../../enum/SearchComponents';
import IndexFields from '../../enum/IndexFields';
import ResultCard from './ResultCard';
import Pagination from '../../../../common/components/results/Pagination';

import resultsStyles from '../../../../common/styles/Results.module.scss';
import styles from './ResultsContainer.module.scss';

const ResultsContainer = () => {
  const { t } = useTranslation();

  return (
    <div className={classNames(
      resultsStyles.ResultsContainer,
      styles.ResultsContainer
    )}>
      <ReactiveList
        className={classNames(
          resultsStyles.ResultsContainer__container,
          styles.ResultsContainer__container
        )}
        componentId={SearchComponents.RESULTS}
        size={10}
        pages={5}
        pagination={true}
        dataField={IndexFields.TITLE}
        react={{
          and: [
            SearchComponents.SEARCH_BAR,
            SearchComponents.SECTOR,
            SearchComponents.ORGAN
          ]
        }}
        renderResultStats={(stats) => (
          <div className={resultsStyles.ResultsContainer__stats}>
            <span className={classNames(
              resultsStyles.stats__count,
              styles['stats__count--policymakers']
            )}>
              <strong>{stats.numberOfResults}</strong>
              {t('SEARCH:results-count')}
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
          <ReactiveList.ResultCardsWrapper
            style={{
              margin: 0,
              gap: '24px'
            }}
          >
            {data.map((item: any) => (
              <ResultCard
                key={item.id}
                {...item}
              />
            ))}
          </ReactiveList.ResultCardsWrapper>
        )}
      />
    </div>
  );
}

export default ResultsContainer;
