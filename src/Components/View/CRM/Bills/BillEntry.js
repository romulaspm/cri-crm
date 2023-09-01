import { useEffect, useState, React, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Input, Row, Table } from "reactstrap";
import ci from "../../../../images/ci-cosmetic-clinic.jpeg";
import "../../CRM/styles/style.css";
import ReactToPrint from "react-to-print";

const BillEntry = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const date = new Date();
  const [buttonHide, setButtonHide] = useState({ display: "normal" });
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };
  const [total, setTotal] = useState(0);
  const [description, setDescription] = useState([
    "DERMAT CONSULTATION",
    "HAIRLOSS CONSULTATION",
    "PRP",
    "GFC",
    "BIOTIN PRP",
    "HAIR TRANSPLANT",
  ]);
  const [billEntryData, setBillEntryData] = useState([]);
  const [inputValues, setInputValues] = useState({
    input1: 0,
    input2: 0,
    input3: 0,
    input4: 0,
    input5: 0,
    input6: 0,
  });
  const calculateTotal = () => {
    const values = Object.values(inputValues).map((value) => parseFloat(value));
    const total = values.reduce((acc, currentValue) => {
      const numericValue = parseFloat(currentValue);
      return acc + numericValue;
    }, 0);
    console.log(total);
    setTotal(parseFloat(total));
    //  return total;
  };

  useEffect(() => {
    console.log(data);
    console.log(inputValues);
    if (inputValues) {
      // const v = calculateTotal();
      //  setTotalAmount(v);
    }
    if (inputValues) calculateTotal();
  }, [data, inputValues, calculateTotal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert null or empty string to 0
    const numericValue = value === null || value === "" ? 0 : parseFloat(value);

    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: numericValue,
    }));
    console.log(inputValues);
  };
  // 3535 ron bus
  // km 65728 km 28-aug-23

  return (
    <Container ref={componentRef} className="p-5">
      <Row className="d-flex justify-content-end mb-5">
        <Col md={2}>
          <ReactToPrint
            trigger={() => (
              <Button
                size="sm"
                onClick={() => setButtonHide({ display: "none" })}
              >
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Col>
      </Row>
      <div ref={componentRef} className="p-5">
        <Row className="pt-1">
          <Col md="2">
            <img src={ci} alt="image" style={{ width: "150px" }} />
          </Col>
          <Col className="d-flex justify-content-center">
            <div>
              <h6 style={{ color: "red" }}>
                Medical House for Diagnosis and Treatment
              </h6>
              <h6 className="pill">1st Floor, Khansaheb Building,</h6>
              <h6>Al Zahra Street, Maysaloon</h6>
              <h6>Near Sharjah CID Office, Zip Code. 20226</h6>
            </div>
          </Col>
          <Col md="3">
            <h4>Invoice</h4>
            <h6 className="mt-3">Date : {formatDate(date)}</h6>
          </Col>
        </Row>
        <Row className="pt-5">
          <Col>
            <h6>Client Name : {data && data.otData.fname}</h6>
            <h6>Sex : {data && data.otData.sex}</h6>
            <h6>MRN : {data && data.otData.mrn}</h6>
          </Col>
          <Col>
            <h6>Contact No : {data && data.otData.contactno}</h6>
            <h6>Nationality : {data && data.otData.nationality}</h6>
            <Row>
              {" "}
              <Col md={2}>
                <h6> Branch :</h6>
              </Col>
              <Col md={5}>
                <Input type="text" />
              </Col>{" "}
            </Row>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col md="5">
            <h5>Treatment {}</h5>
          </Col>
        </Row>

        <Table style={{ backgroundColor: "blue" }} bordered>
          <thead>
            <tr>
              <th
                style={{
                  backgroundColor: "rgb(126, 169, 255)",
                  width: "40%",
                  textAlign: "center",
                }}
              >
                Procedure Description
              </th>
              <th
                style={{ backgroundColor: "rgb(126, 169, 255)", width: "10%" }}
              >
                {" "}
              </th>
              <th
                style={{ backgroundColor: "rgb(126, 169, 255)", width: "30%" }}
              >
                {" "}
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input
                  type="text"
                  list="data"
                  //  readOnly={MRN !== ""}
                  onChange={(e) => {
                    const mrn = data && data.otData.mrn;
                    if (billEntryData.mrn !== mrn) {
                      const temp = [
                        {
                          SlNo: e.target.key,
                          mrn,
                          date: formatDate(date),
                          billEntry: [{ description }],
                        },
                      ];
                      console.log(temp);

                      setBillEntryData(e.target.value);
                    } else {
                      const temp = billEntryData;
                      setBillEntryData(...temp, { description });
                    }
                  }}
                />
                <datalist id="data">
                  {description.map((item, key) => (
                    <option key={key} value={item} />
                  ))}
                </datalist>
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input1" onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input2" onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input3" onChange={handleInputChange} />
              </td>
            </tr>
            <tr>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input4" onChange={handleInputChange} />
              </td>
            </tr>{" "}
            <tr>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input5" onChange={handleInputChange} />
              </td>
            </tr>{" "}
            <tr>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" />
              </td>
              <td>
                <Input type="text" name="input6" onChange={handleInputChange} />
              </td>
            </tr>
            <tr scope="row">
              <td colSpan={2}>Total</td>
              <td>
                {" "}
                <Input readOnly value={total} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Row className="d-flex justify-content-end">
        <Col md={2}>
          <ReactToPrint
            trigger={() => (
              <Button
                size="sm"
                onClick={() => setButtonHide({ display: "none" })}
              >
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Col>
      </Row>
      <Row>
        <Col md="1">
          <Button outline onClick={() => navigate("/crm")} style={buttonHide}>
            Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BillEntry;
