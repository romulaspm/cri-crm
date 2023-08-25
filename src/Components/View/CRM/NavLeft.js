import { Calendar, Search } from "react-feather";
import "./styles/style.css";
import {
  Button,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, React, version, Fragment } from "react";

const NavLeft = (props) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [modal, setModal] = useState(false);
  const [selectedCM, setSelectedCM] = useState("");
  const [otData, setOTData] = useState();
  const [modalName, setModalName] = useState("search");
  const [token] = useState(
    sessionStorage.getItem("token")
      ? JSON.parse(sessionStorage.getItem("token"))
      : props.token
  );

  const toggle = () => setModal(!modal);

  useEffect(() => {
    axios
      .get("http://localhost:8000/customers")
      .then((res) => {
        console.log(res);
        setSearch(res.data);
        props.customerDataHandler(res.data);
        // setOTData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (searchInput) {
      const v = search.filter((cm) => {
        console.log(cm);
        return `${cm.contactno} ${cm.fname} ${cm.mrn}`
          .toLowerCase()
          .includes(searchInput.trim().toLowerCase());
      });
      setSearchResults(v);
    }
  }, [searchInput]);

  useEffect(() => {
    if (selectedCM) {
      props.searchUpdateHandler(selectedCM);
      setOTData(selectedCM);
      console.log(selectedCM);
    } else if (props.customerData) {
      //  setOTData(props.customerData);
      console.log(props.customerData);
    }
  }, [selectedCM]);

  const ModalContent = () => {
    if (modalName === "search") {
      return (
        <Fragment>
          <ModalHeader toggle={toggle}>Search Results</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Contact No</th>
                  <th>Address</th>
                  <th>Treatment Type</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {searchResults &&
                  searchResults.map((cm) => {
                    return (
                      <tr>
                        <td>
                          {cm.fname} {cm.sname}
                        </td>
                        <td>{cm.contactno}</td>
                        <td>{cm.address}</td>
                        <td>{cm.treatmenttype}</td>
                        <td>{cm.mrn}</td>
                        <td>
                          {
                            <Input
                              type="radio"
                              name="select"
                              checked={selectedCM.mrn === cm.mrn}
                              onChange={() => setSelectedCM(cm)}
                            />
                          }
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Ok
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Fragment>
      );
    } else if (modalName === "otBooking") {
      return (
        <Fragment>
          <ModalHeader toggle={toggle}>OT Booking</ModalHeader>
          <ModalBody>
            <Row>
              <Col></Col>
              <Col></Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Ok
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Fragment>
      );
    } else return {};
  };

  return (
    <Col md="2" className="l-nav-bg">
      <Row>
        <Col md="12">
          <InputGroup className="mb-4">
            <Input
              placeholder="search"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <InputGroupText>
              {" "}
              <Search
                onClick={() => {
                  setModalName("search");
                  toggle();
                }}
              />
            </InputGroupText>
          </InputGroup>
          <Row
            style={{ paddingLeft: "12px", paddingRight: "12px" }}
            className="mb-4"
          >
            <Button
              outline
              onClick={() => navigate("/reports", { replace: true })}
            >
              Reports
            </Button>
          </Row>
          <Row style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            <Button
              outline
              onClick={() => {
                navigate("/otBooking", {
                  //replace: true,
                  state: {
                    otData,
                    token: props.token,
                    customerData: props.customerData,
                  },
                });
              }}
            >
              OT Booking
            </Button>
          </Row>
          <Row style={{ paddingLeft: "12px", paddingRight: "12px" }}>
            <Button
              outline
              onClick={() => {
                if (otData && otData.mrn) {
                  navigate("/billentry", {
                    //replace: true,
                    state: {
                      otData,
                      token: props.token,
                      customerData: props.customerData,
                    },
                  });
                } else {
                  alert("please select a customer");
                }
              }}
            >
              Invoice
            </Button>
          </Row>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggle} style={{ minWidth: "70%" }}>
        {<ModalContent />}
      </Modal>
    </Col>
  );
};

export default NavLeft;
