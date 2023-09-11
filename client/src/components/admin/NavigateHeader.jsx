import React, { useEffect, useState } from "react";
import "./Style/Home.css";
import { BiEdit } from "react-icons/bi";
import { MdDeleteSweep } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

Modal.setAppElement("#root");
function NavigateHeader() {
  const [moduleData, setModuleData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [delmodalIsOpen, setDelIsOpen] = useState(false);
  const [selectVlaue, setSelectVlaue] = useState("");
  const [selectId, setSelectId] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [selectedModule, setSelectedModule] = useState(""); // Track the selected module
  const [selectedTarget, setSelectedTarget] = useState("");
  const [url, setUrl] = useState("");
  // const [selectedOrder, setSelectedOrder] = useState("");
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const customStyles = {
    content: {
      top: "50%",
      left: "55%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const openModal = (module_name, id) => {
    console.log(module_name, id);
    setSelectId(id);
    setSelectedModule(module_name);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchModule = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/get/nav_link/modules`
    );
    console.log(response.data.result, "redasdal");
    setModuleData(response.data.result);
  };

  const handleClick = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("selectId", selectId);
    formData.append("selectedModule", selectedModule);
    formData.append("selectVlaue", selectVlaue);
    formData.append("orderValue", orderValue);
    formData.append("url", url);
    const formDataObject = Object.fromEntries(formData.entries());
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(`http://localhost:8000/api/post/nav_data`, formDataObject, config)
      .then((res) => {
        toast.success("Updated Successfuly ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Request Denied ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  const handleButClick = () => {
    Navigate("/navigation");
  };
  const FetchTarget_value = async () => {
    axios
      .get(`http://localhost:8000/api/get/navigation_link/target/${selectId}`)
      .then((res) => {
        const response = res.data.data;
        console.log(response, "value of selected module");
        const keyValueObject = response[0];
        setSelectedTarget(keyValueObject.nav_link_target);
        // console.log(keyValueObject.nav_link_display_order, "dddd");
        setOrderValue(keyValueObject.nav_link_display_order);
        setUrl(keyValueObject.nav_link_LINKS);
        // console.log(ss"order");
      })

      .catch((err) => console.log(err));
  };
  const handleDelete = (id) => {
    console.log(`the ${id} deleted`);
    axios
      .put(`http://localhost:8000/api/delete/nav_link/status/deleted/${id}`)
      .then((res) => {
        toast.success("Deleted Successfuly ", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Request Denied ", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  useEffect(() => {
    fetchModule();
    FetchTarget_value();
  }, []);

  return (
    <>
      <div className="top">
        <div className="first-top">
          <h5>Navigation Page Listing</h5>
          <div className="back_but">
            <button onClick={handleButClick}>Back</button>
          </div>
        </div>
        <div className="main-cont">
          <div className="navigate-home">
            <table className="table table-striped table-dark">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Title</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {moduleData.map((item, index) => (
                  <tr key={item.Nav_link_id}>
                    <th scope="row">{item.Nav_link_id}</th>
                    <td>{item.nav_link_title}</td>
                    <td>
                      <div className="buttons">
                        <div className="logoo">
                          <Link>
                            <BiEdit
                              color="white"
                              size={20}
                              onClick={() =>
                                openModal(item.nav_link_title, item.Nav_link_id)
                              }
                            />
                          </Link>
                        </div>
                        <div className="logoo">
                          <Link>
                            <MdDeleteSweep
                              color="white"
                              size={20}
                              onClick={() => handleDelete(item.Nav_link_id)}
                            />
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          // onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {/* <p>{selectedModule}</p> */}

          <form className="Modal_form">
            <div className="main_cont">
              <div className="sec_child_input">
                <div className="input_lab">
                  <h6>Module Name</h6>
                </div>
                <input
                  type="text"
                  value={selectedModule}
                  className="input_select"
                  onChange={(e) => {
                    setSelectedModule(e.target.value);
                  }}
                />
              </div>
              <div className="first_child_input">
                <div className="input_lab">
                  <h6>Link Target</h6>
                </div>

                <select
                  className="form-select"
                  aria-label="Default select example"
                  name="select_link"
                  onChange={(e) => setSelectVlaue(e.target.value)}
                >
                  <option selected>Select</option>
                  <option
                    value="_self"
                    selected={selectedTarget === "_self" ? "selected" : ""}
                  >
                    Current window
                  </option>
                  <option
                    value="_blank"
                    selected={selectedTarget === "_blank" ? "selected" : ""}
                  >
                    Another Window
                  </option>
                </select>
              </div>
              <div className="sec_child_input">
                <div className="input_lab">
                  <h6>Display Order</h6>
                </div>
                <input
                  type="text"
                  value={orderValue}
                  className="input_select"
                  onChange={(e) => {
                    setOrderValue(e.target.value);
                  }}
                />
              </div>
              <div className="sec_child_input">
                <div className="input_lab">
                  <h6>URL or LINK</h6>
                </div>
                <input
                  type="text"
                  value={url}
                  className="input_select"
                  onChange={(e) => {
                    setUrl(e.target.value);
                  }}
                />
              </div>
              <div className="third_child_input">
                <div className="first_but"></div>
                <button className="" onClick={closeModal}>
                  close
                </button>
                <div className="sec_but">
                  <button className="" onClick={handleClick}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
}

export default NavigateHeader;
