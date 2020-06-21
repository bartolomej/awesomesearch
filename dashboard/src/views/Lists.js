import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row, Alert } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import { getLists } from "../api";


function Lists () {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLists()
      .then(setLists)
      .catch(setError);
  }, []);

  return (
    <Container fluid className="main-content-container px-4">

      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Indexed Lists" className="text-sm-left"/>
      </Row>

      {error && (
        <Alert theme="danger">
          Error occurred: {error.message.toLowerCase()}
        </Alert>
      )}

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active Users</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                <tr>
                  <th scope="col" className="border-0">
                    #
                  </th>
                  <th scope="col" className="border-0">
                    Image
                  </th>
                  <th scope="col" className="border-0">
                    Title
                  </th>
                  <th scope="col" className="border-0">
                    Links
                  </th>
                  <th scope="col" className="border-0">
                    Url
                  </th>
                </tr>
                </thead>
                <tbody>
                {lists.map(l => (
                  <tr key={l.uid}>
                    <td>{l.uid}</td>
                    <td><img style={{ width: 30, height: 30, borderRadius: '50%'}} src={l.image_url} /></td>
                    <td>{l.title}</td>
                    <td>{l.link_count}</td>
                    <td><a target="_blank" href={l.url}>{l.url}</a></td>
                  </tr>
                ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>

    </Container>
  )
}

export default Lists;
