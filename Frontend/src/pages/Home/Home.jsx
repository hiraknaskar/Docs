import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/nav";
import axiosInstance from "../../utils/axiosInstance";
import Cards from "../../Components/Cards";
import { MdAdd } from "react-icons/md";
import AddEditNote from "../../Components/AddEditNote";
import Modal from "react-modal";
import Toast from "../../Components/ToastMessage/Toast";

Modal.setAppElement("#root"); // Ensuring accessibility for screen readers

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [first, setfirst] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "info",
  });

  const [AllNotes, setAllNotes] = useState([]);
  const [UserInfo, setUserInfo] = useState(null);
  const reference = useRef(null);

  const [isSearch, setisSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: "info",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-note");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Search for notes
  const onSearchNote = async (query) => {
    if (!query) {
      getAllNotes();
      return;
    }
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setisSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        isPinned: !noteData.isPinned,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setisSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <div className="relative w-full h-screen bg-zinc-800 overflow-hidden">
      {/* Navbar */}
      <div className="relative z-[5]">
        <Navbar
          UserInfo={UserInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />
      </div>

      {/* Background Section */}
      <div className="absolute z-[1] w-full h-full">
        <div className="w-full py-10 flex justify-center text-zinc-600 font-semibold text-xl absolute top-[5%]">
          Documents
        </div>
        <h1 className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] text-[13vw] leading-none font-semibold text-zinc-900">
          Docs.
        </h1>
      </div>

      {/* Foreground Section for Cards */}
      <div
        ref={reference}
        className="relative z-[4] w-full h-full flex gap-10 flex-wrap p-5 overflow-y-auto"
      >
        {AllNotes.length > 0 ? (
          AllNotes.map((item) => (
            <Cards
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => updateIsPinned(item)}
              reference={reference}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center text-primary font-semibold text-lg">
            {isSearch
              ? "No Notes Found"
              : "Every great innovation begins with a single thought. Get started on your journey—write your first note!"}
          </div>
        )}

        {/* Add Note Button */}
        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-zinc-600 hover:bg-primary fixed right-10 bottom-10 z-[6] transform hover:scale-110 transition-all duration-300"
          onClick={() => {
            setOpenAddEditModel({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>

      {/* Modal for Add/Edit Note */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() =>
          setOpenAddEditModel({ ...openAddEditModel, isShown: false })
        }
        className="fixed inset-0 flex items-center justify-center z-[1001]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
        contentLabel="Add/Edit Note"
      >
        <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-lg mx-auto">
          <AddEditNote
            type={openAddEditModel.type}
            noteData={openAddEditModel.data}
            onclose={() => {
              setOpenAddEditModel({ isShown: false, type: "add", data: null });
            }}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
          />
        </div>
      </Modal>

      {/* Toast Message */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
