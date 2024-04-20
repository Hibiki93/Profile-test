import "./App.css";

import {
  faAdd,
  faTrash,
  faArrowUp,
  faArrowDown,
  faEdit,
  faSliders,
  faGamepad,
  faPhotoFilm,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState,useEffect } from "react";

function App() {
  const icons = {
    faAdd,
    faTrash,
    faArrowUp,
    faArrowDown,
    faEdit,
    faSliders,
    faGamepad,
    faPhotoFilm,
    faMusic,
  };
  const [menuItem, setMenu] = useState([
    {
      "name": "Default",
      "editAble": false,
      "active": true,
      "icon": "faSliders",
    },
    {
      "name": "Game",
      "editAble": false,
      "active": false,
      "icon": "faGamepad",
    },
    {
      "name": "Movie",
      "editAble": false,
      "active": false,
      "icon": "faPhotoFilm",
    },
    {
      "name": "Music",
      "editAble": false,
      "active": false,
      "icon": "faMusic",
    },
    {
      "name": "Custom",
      "editAble": true,
      "active": false,
      "icon": "faSliders",
    },
    {
      "name": "demo long text demo long text demo",
      "editAble": true,
      "active": false,
      "icon": "faSliders",
    },
  ]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [editInput, setEditInput] = useState(false);

  const [previousName, setPreviousName] = useState("");

  const getActiveItemName = () => {
    const activeItem = menuItem.find((item) => item.active);
    return activeItem ? activeItem.name : null;
  };

  const moveItemUp = () => {
    const activeIndex = menuItem.findIndex((item) => item.active);
    if (activeIndex > 0) {
      const updatedMenu = [...menuItem];
      const temp = updatedMenu[activeIndex];
      updatedMenu[activeIndex] = updatedMenu[activeIndex - 1];
      updatedMenu[activeIndex - 1] = temp;
      setMenu([...updatedMenu]);
      handleChange(updatedMenu);
    }
  };

  const moveItemDown = () => {
    const activeIndex = menuItem.findIndex((item) => item.active);
    if (activeIndex < menuItem.length - 1) {
      const updatedMenu = [...menuItem];
      const temp = updatedMenu[activeIndex];
      updatedMenu[activeIndex] = updatedMenu[activeIndex + 1];
      updatedMenu[activeIndex + 1] = temp;
      setMenu([...updatedMenu]);
      handleChange(updatedMenu);
    }
  };

  const handleMenuItemClick = (index) => {
    const updatedMenu = menuItem.map((item, i) => ({
      ...item,
      active: i === index ? true : false,
    }));
    setMenu(updatedMenu);
    setPreviousName(updatedMenu[index].name);
    handleChange(updatedMenu);
  };

  const handleAddItem = () => {
    const newItemName = `New Profile`;
    let newName = newItemName;
    let count = 1;

    // Check for duplicate names
    while (menuItem.some((item) => item.name === newName)) {
      count++;
      newName = `${newItemName} (${count})`;
    }

    const newItem = {
      name: newName,
      editAble: true,
      active: true,
      icon: "faSliders",
    };
    const updatedMenu = menuItem.map((item) => ({ ...item, active: false }));
    updatedMenu.push(newItem);
    setMenu(updatedMenu);
    handleChange(updatedMenu);
  };

  const handleRemoveItem = () => {
    const updatedMenu = menuItem.filter((item) => !item.active);
    setMenu(updatedMenu);
    const deletedItemIndex = menuItem.findIndex((item) => item.active);
    if (deletedItemIndex !== -1) {
      const updatedMenuWithDefaultActive = updatedMenu.map((item) => ({
        ...item,
        active: item.name === "Default",
      }));
      setMenu(updatedMenuWithDefaultActive);
      handleChange(updatedMenu)
    }
    setDeleteModal(false);
  };

  const handleRemoveConfirm = () => {
    setDeleteModal(!deleteModal);
  };

  const handleBackDrop = () => {
    setDeleteModal(false);
    const activeIndex = menuItem.findIndex((item) => item.active);
    const updatedMenu = [...menuItem];

    if (editInput && menuItem[activeIndex].name.trim() === "") {
      updatedMenu[activeIndex].name = previousName;
      setMenu(updatedMenu);
    }else{
      setMenu(updatedMenu);
      handleChange(updatedMenu);
    }
    setEditInput(false);
  };

  const handleEditMode = () => {
    setEditInput(!editInput);
  };

  const handleInputChange = (e, index) => {
    const updatedMenu = [...menuItem];
    updatedMenu[index].name = e.target.value;
    setMenu(updatedMenu);
  };

  const [profileList, setProfileList] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  let saveTimeout; 

  const API_URL = "https://hibiki-freelancer-api.onrender.com/profile"
  // const API_URL = "http://localhost:3001/profile"
  const saveProfileListToAPI = async (profileList) => {
    const modifiedData = profileList.map((item, index) => ({
      ...item,
      sort: index
    }));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Handle success response
      console.log('Data posted successfully');
      
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
    }
  
  };

  const handleChange = (newProfileList) => {
    setProfileList(newProfileList);
    setUnsavedChanges(true);

    // Reset the timeout
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      setUnsavedChanges(false);
      saveProfileListToAPI(newProfileList); 
    }, 3000); 
  };
  useEffect(() => {
    return () => clearTimeout(saveTimeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        const sortedData = data.data.sort((a, b) => {
          if (a.sort === undefined && b.sort === undefined) {
            return 0;
          } else if (a.sort === undefined) {
            return 1;
          } else if (b.sort === undefined) {
            return -1;
          } else {
            return a.sort - b.sort;
          }
        });
        setMenu(sortedData);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div
      className="container-fluid d-flex flex-wrap px-0"
      style={{ minHeight: "100vh" }}
    >
      <div className="container col-2 menu-wapper">
        <div className="menu-title">Profile List</div>
        <div className="menu-list">
          <div
            className={`backDrop ${
              deleteModal || editInput ? "d-block" : "d-none"
            }`}
            onClick={handleBackDrop}
          ></div>
          <div className="menu-border">
            {menuItem.map((item, index) => (
              <div
                className={`menu-item ${item.active ? "active" : ""}`}
                key={index}
                onClick={() => handleMenuItemClick(index)}
              >
                <FontAwesomeIcon icon={icons[item.icon]} className="me-2" />
                {editInput && item.active ? (
                  <input
                    className="edit-input"
                    value={item.name}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                ) : (
                  item.name
                )}
              </div>
            ))}
            {/* <input id="profileRename" className="profile-item" placeholder="Enter Profile Name" maxlength="25"/> */}

            {/* <div id="profileDelCfm" className="profile-del alert flex">
            <div className="title">delete eq</div>
            <div className="body-text t-center" id="delName">Default</div>
            <div className="thx-btn" id="cfmDelete">delete</div>
          </div> */}
          </div>
          <div className="toolbar d-flex">
            <div className="d-flex">
              {menuItem.some((item) => item.active && item.editAble) && ( // Check if active item is editable
                <>
                  <div className="position-relative">
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="function-btn"
                      onClick={handleRemoveConfirm}
                    />
                    <div
                      className={`deleteEq position-absolute ${
                        deleteModal ? "visible" : "invisible"
                      }`}
                    >
                      <div className="text-uppercase font-weight-bold delete-title">
                        Delete EQ
                      </div>
                      <div className="mb-2">{getActiveItemName()}</div>
                      <div className="deleteBtn" onClick={handleRemoveItem}>
                        DELETE
                      </div>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="function-btn"
                    onClick={handleEditMode}
                  />
                </>
              )}
              <FontAwesomeIcon
                icon={faAdd}
                className="function-btn"
                onClick={handleAddItem}
              />
            </div>
            <div>
              <FontAwesomeIcon
                icon={faArrowDown}
                className="function-btn"
                onClick={moveItemDown}
              />
              <FontAwesomeIcon
                icon={faArrowUp}
                className="function-btn"
                onClick={moveItemUp}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-10 eq-bg">
        <div className="sub-title flex">
          <h1 id="eqTitle" className="eq-title">
            {getActiveItemName()}
          </h1>
          {getActiveItemName() === 'Default' && (
            <div className='text-start'>
              <p>
                Hi, I am Eric Pang.
                <br/>
                <a href="https://hibiki93.github.io/resume/" target="_blank">View my online resume</a>
                <br/>
                <a href="#" target="_blank">View my code on github</a>
                <br/>
                <a href="#" target="_blank">View my API documentation</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
