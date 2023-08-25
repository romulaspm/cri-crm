import axios from "axios";
import { useState, useMemo, React, useEffect, Fragment } from "react";
import "./styles/style.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";
import NavLeft from "./NavLeft";
import { useNavigate, useLocation } from "react-router-dom";

const CRM = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authData = location.state;
  const [token] = useState(authData.token ? authData.token : "");
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  //const [id, setId] = useState("");
  const [dob, setDOB] = useState("");
  const [contactno, setContactno] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [locality, setLocality] = useState("");
  const [treatmenttype, setTreatmentType] = useState("PRP");
  const [remarks, setRemarks] = useState("");
  const [patientcoordinator, setPatientCoordinator] = useState("");
  const date = new Date();
  const [MRN, setMRN] = useState("");
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchData, setSearchData] = useState("");
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [customerData, setCustomerData] = useState("");
  const [appointmentData, setAppointmentData] = useState("");
  const [appointmentCurrent, setAppointmentCurrent] = useState("");
  const toggle = () => setModal(!modal);
  const [modalName, setModalName] = useState("");
  const [sex, setSex] = useState("male");
  const toggleEdit = () => {
    setModal(!modal);
    if (MRN) {
      setEditMode(true);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  useEffect(() => {
    if (token)
      axios
        .get("http://localhost:8000/appointments", {
          params: {
            date: `${formatDate(date)}`,
            fromDate: `${formatDate(date)}`,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setAppointmentData(res.data);
        })
        .catch((err) => console.log(err));
    const tokenSession = JSON.parse(sessionStorage.getItem("token"));
    if (authData && !tokenSession) {
      sessionStorage.setItem("token", JSON.stringify(authData.token));
    }
  }, [authData]);

  useEffect(() => {
    if (appointmentData && searchData) {
      const appointmentC = appointmentData
        .filter((filter) => filter.mrn === searchData.mrn)
        .filter((item) => {
          console.log(item);
          const currentDateWithoutTime = new Date();
          currentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight

          const appointmentDateWithoutTime = new Date(item.appointmentdate);

          appointmentDateWithoutTime.setHours(0, 0, 0, 0); // Set time to midnight

          if (appointmentDateWithoutTime >= currentDateWithoutTime) {
            return true;
          }
        });
      console.log(appointmentC, searchData, appointmentData);
      setAppointmentCurrent(appointmentC);
    }
  }, [appointmentData, searchData]);

  const submitHandler = async () => {
    try {
      const response = await axios.post("http://localhost:8000/add-customer", {
        fname,
        sname,
        contactno,
        nationality,
        locality,
        address,
        treatmenttype,
        remarks,
        patientcoordinator,
        date,
        dob,
        sex,
      });

      if (response.status === 200) {
        // Handle successful login
        alert("Save successful");
        console.log(response.data);
        setMRN(response.data.mrn);
      } else {
        // Handle failed login
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    //   handleCountry();
    if (verified) {
      submitHandler();
      setVerified(false);
    }

    console.log(authData);
  }, [verified]);

  const searchUpdateHandler = (data) => {
    setSearchData(data);
    setFname(data.fname);
    setSname(data.sname);
    setContactno(data.contactno);
    setAddress(data.address);
    setNationality(data.nationality);
    setLocality(data.location);
    setTreatmentType(data.treatmenttype);
    setRemarks(data.remarks);
    setPatientCoordinator(data.patientcoordinator);
    setMRN(data.mrn);
    setDOB(data.dob);
    setSex(data.sex);
    console.log(data);
  };

  const customerDataHandler = (data) => {
    setCustomerData(data);
  };

  const handleSubmit = async () => {
    if (MRN && editMode) {
      alert("MRN && edit");
      try {
        const response = await axios.post(
          "http://localhost:8000/edit-customer",
          {
            fname,
            sname,
            contactno,
            address,
            nationality,
            locality,
            treatmenttype,
            remarks,
            patientcoordinator,
            date,
            dob,
            sex,
            mrn: MRN,
          }
        );

        if (response.status === 200) {
          // Handle successful login
          alert("Edit successful");
          //   console.log(response.data.mrn);
          //  setMRN(response.data.mrn);
        } else {
          // Handle failed login
          console.log("Invalid credentials");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      if (
        fname.length > 2 &&
        contactno.length > 9 &&
        address.length > 3 &&
        treatmenttype &&
        patientcoordinator.length > 3 &&
        date &&
        dob
      ) {
        setVerified(true);
      } else {
        setErrorMessage("Missing data, Kindly enter the details");
        setModalName("error");
        toggle();
      }
    }
  };

  const ModalContent = () => {
    if (modalName === "edit") {
      return (
        <Fragment>
          <ModalBody>
            <h6>Do you want to edit the data</h6>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleEdit}>
              Ok
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Fragment>
      );
    } else if (modalName === "error") {
      return (
        <Fragment>
          <ModalBody>
            <h6>{errorMessage}</h6>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Fragment>
      );
    }
  };

  const appointment = useMemo(() => {
    if (appointmentCurrent) {
      return (
        <Toast>
          <ToastHeader icon="success">
            <h6>Next Appointment</h6>
          </ToastHeader>
          {appointmentCurrent.map((item) => {
            return (
              <ToastBody>
                Treatment : {treatmenttype} <br />
                Date: {}
                {item.appointmentdate}
                <br />
                Time: {item.time}
                <br />
                Doctor Name: {item.doctor}
              </ToastBody>
            );
          })}
        </Toast>
      );
    }
  }, [appointmentCurrent]);

  const rightDiv = useMemo(() => {
    return (
      <Col md="3">
        <Row>
          <Col md="12">
            <Row>
              <Col className="d-flex flex-column">
                <div className="mt-auto">
                  <div style={{ minHeight: "66vh" }}>
                    <Row>
                      <Label sm="4">Date :</Label>
                      <Col md="6">
                        <Input
                          readOnly
                          type="text"
                          value={`${date.getDate()} / ${
                            date.getMonth() + 1
                          } /  ${date.getFullYear()} `}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Label sm="4">Location :</Label>
                      <Col md="6">
                        <Input
                          type="text"
                          value={locality}
                          readOnly={MRN !== "" && !editMode}
                          onChange={(e) => {
                            // (e.target.value);
                            setLocality(e.target.value);
                          }}
                        ></Input>
                      </Col>
                    </Row>
                    {appointment}
                  </div>
                </div>
              </Col>

              <div>
                <Row>
                  <Col md="3">
                    {
                      // <Button className="me-1">Save</Button>
                    }
                  </Col>
                  <Col>
                    <Button
                      onClick={() => {
                        const otData = {
                          fname,
                          sname,
                          contactno,
                          address,
                          treatmenttype,
                          remarks,
                          patientcoordinator,
                          date: formatDate(date),
                          dob,
                          mrn: MRN,
                        };
                        if (otData && otData.mrn) {
                          navigate("/otBooking", {
                            //replace: true,
                            state: {
                              otData,
                              customerData,
                              token,
                            },
                          });
                        } else {
                          alert("please select a customer");
                        }
                      }}
                    >
                      Book Appointment
                    </Button>
                  </Col>
                </Row>
              </div>
            </Row>
          </Col>
        </Row>
        <Row></Row>
      </Col>
    );
  }, [appointment]);

  const main = useMemo(() => {
    return (
      <Container>
        <Card>
          <CardHeader className="d-flex justify-content-center bg-info">
            <h4>Patient Relations Manager</h4>
          </CardHeader>
          <CardBody>
            <Row className="d-flex justify-content-end mb-4">
              <Label sm="1">MR No</Label>
              <Col md="3">
                <Input type="text" readOnly value={MRN} />
              </Col>
            </Row>
            <Row>
              <NavLeft
                searchUpdateHandler={searchUpdateHandler}
                customerDataHandler={customerDataHandler}
                customerData={customerData}
                token={token}
              />
              <Col>
                <Row>
                  <Label className="custom-col">First Name :</Label>
                  <Col md="3">
                    <Input
                      type="text"
                      value={fname}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setFname(e.target.value);
                      }}
                    />
                  </Col>
                  <Label className="custom-col">Second Name :</Label>
                  <Col md="3">
                    <Input
                      type="text"
                      value={sname}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setSname(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Label className="custom-col">Contact No:</Label>
                  <Col md="3">
                    <Input
                      type="mobile"
                      value={contactno}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setContactno(e.target.value);
                      }}
                    />
                  </Col>
                  <Label className="custom-col">Nationality</Label>
                  <Col md="3">
                    <Input
                      type="text"
                      value={nationality}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setNationality(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Label className="custom-col"> DOB:</Label>
                  <Col md="3">
                    <Input
                      type="date"
                      value={dob}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setDOB(e.target.value);
                      }}
                    />
                  </Col>
                  <Label className="custom-col-r ms-5"> Male:</Label>
                  <Col md="1">
                    <Input
                      type="radio"
                      value={"male"}
                      checked={sex === "male"}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setSex(e.target.value);
                      }}
                    />
                  </Col>
                  <Label className="custom-col-r"> Female:</Label>
                  <Col md="1">
                    <Input
                      type="radio"
                      value={"female"}
                      checked={sex === "female"}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setSex(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Label className="custom-col"> Address</Label>
                  <Col md="8">
                    <Input
                      type="text"
                      value={address}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Label className="custom-col"> Treatment</Label>
                  <Col md="3">
                    <Input
                      type="select"
                      readOnly={MRN !== ""}
                      onChange={(e) => {
                        setTreatmentType(e.target.value);
                      }}
                    >
                      <option
                        value="PRP"
                        // selected={treatmentType === "PRP"}
                      >
                        PRP
                      </option>
                      <option
                        value="Hair Transplant"
                        readOnly={MRN !== "" && !editMode}
                        //  selected={treatmentType === "Hair Transplant"}
                      >
                        Hair Transplant
                      </option>
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Label className="custom-col"> Remarks</Label>
                  <Col md="8">
                    <Input
                      type="text"
                      value={remarks}
                      readOnly={MRN !== "" && !editMode}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Label className="custom-col"> Patient Coordinator</Label>
                  <Col md="3">
                    <Input
                      //defaultValue={"Auto for Agent Login"}
                      type="text"
                      readOnly={MRN !== "" && !editMode}
                      value={patientcoordinator}
                      onChange={(e) => {
                        setPatientCoordinator(e.target.value);
                      }}
                    />
                  </Col>
                </Row>

                {!MRN && (
                  <Button onClick={handleSubmit} className="mt-4">
                    {" "}
                    Submit
                  </Button>
                )}
                {editMode && MRN && (
                  <Button onClick={handleSubmit} className="mt-4">
                    {" "}
                    Update
                  </Button>
                )}
                {!editMode && MRN && (
                  <Button
                    onClick={() => {
                      setModalName("edit");
                      toggle();
                    }}
                    className="mt-4"
                  >
                    {" "}
                    Edit
                  </Button>
                )}
              </Col>
              {rightDiv}
            </Row>
          </CardBody>
        </Card>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalContent />
        </Modal>
      </Container>
    );
  }, [handleSubmit, setLocality]);

  return main;
};

export default CRM;
