import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import BigChart from "../components/overview/BigChart";
import TopSearches from "../components/common/TopSearches";
import { getSearchStats, getStats } from "../api";


const Overview = ({ smallStats }) => {
  const [stats, setStats] = useState(null);
  const [queryStats, setQueryStats] = useState(null);
  const [error, setError] = useState(null);
  const [dateStats, setDateStats] = useState(null);

  useEffect(() => {
    const statsInt = setInterval(() => {
      updateStats();
      updateQueryStats();
    }, 1000);
    updateDateStats();

    return () => {
      clearInterval(statsInt);
    }
  }, []);

  function updateStats () {
    getStats().then(s => {
      setStats([
        {
          label: "Lists",
          value: s.list_count,
        },
        {
          label: "Links",
          value: s.link_count,
        },
        {
          label: "Searches",
          value: s.search_count,
        },
      ])
    }).catch(setError)
  }

  function updateDateStats () {
    getSearchStats('date').then(s => {
      setDateStats({
        labels: s.map(e => e.datetime.split('T')[0]),
        datasets: [
          {
            label: "Current Month",
            fill: "start",
            data: s.map(e => e.count).reverse(),
            backgroundColor: "rgba(0,123,255,0.1)",
            borderColor: "rgba(0,123,255,1)",
            pointBackgroundColor: "#ffffff",
            pointHoverBackgroundColor: "rgb(0,123,255)",
            borderWidth: 1.5,
            pointRadius: 0,
            pointHoverRadius: 3
          },
        ]
      })
    }).catch(setError)
  }

  function updateQueryStats () {
    getSearchStats('query').then(s => {
      setQueryStats(
        s.map(s => ({
          title: s.query, value: s.count
        })).slice(0, 9)
      )
    }).catch(setError)
  }

  return (
    <Container fluid className="main-content-container px-4">

      <Row noGutters className="page-header py-4">
        <PageTitle title="Overview" subtitle="Dashboard"
                   className="text-sm-left mb-3"/>
      </Row>

      {error && (
        <Alert theme="danger">
          Error occurred: {error.message.toLowerCase()}
        </Alert>
      )}

      {stats && (
        <Row>
          {stats.map((stats, idx) => (
            <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
              />
            </Col>
          ))}
        </Row>
      )}

      <Row>
        {dateStats && (
          <Col lg="8" md="12" sm="12" className="mb-4">
            <BigChart title={"Searches over time"} chartData={dateStats}/>
          </Col>
        )}

        {/*<Col lg="4" md="6" sm="12" className="mb-4">*/}
        {/*  <UsersByDevice/>*/}
        {/*</Col>*/}

        {queryStats && (
          <Col lg="4" md="12" sm="12" className="mb-4">
            <TopSearches
              title={'Popular queries'}
              referralData={queryStats}
            />
          </Col>
        )}
      </Row>
    </Container>
  );
}

Overview.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

Overview.defaultProps = {
  smallStats: [
    {
      label: "Posts",
      value: "2,390",
      percentage: "4.7%",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
  ]
};

export default Overview;
