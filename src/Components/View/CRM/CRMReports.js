import axios from "axios";
import { useEffect, useState, React } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Container, Row, Table } from "reactstrap";

const CRMReports = () => {
  const navigate = useNavigate();
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("https://cri-crm-d5cd0ee5dc74.herokuapp.com/customers").then((res) => {
      setData(res.data);
      console.log(res);
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center p-5">
          <h4>
            <u>Customer Reports </u>
          </h4>
        </Col>
      </Row>
      <Row>
        <Col md="1">
          <Button outline onClick={() => navigate("/crm")}>
            Back
          </Button>
        </Col>
      </Row>
      <Table striped>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Contact No</th>
            <th>Address</th>
            <th>Treatment Type</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((cm, id) => {
              return (
                <tr key={id}>
                  <td>{id + 1}</td>
                  <td>{cm.date}</td>
                  <td>{cm.fname + cm.sname}</td>
                  <td>{cm.contactno}</td>
                  <td>{cm.address}</td>
                  <td>{cm.treatmenttype}</td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
};

export default CRMReports;
