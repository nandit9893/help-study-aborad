"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { operations } from "@/Utils/Helper";
import toast from "react-hot-toast";
import { performTaskFailure, performTaskSuccess, signInStart } from "@/Redux/User/UserSlice";
import { getAllTasks, performTask } from "@/Utils/API";
import { Loader, Check, ChevronDown } from "lucide-react";
import PreviousOperation from "@/Components/PreviousOperation";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [activeOperation, setActiveOperation] = useState(null);
  const [inputText, setInputText] = useState("");
  const [steps, setSteps] = useState([]);
  const [output, setOutput] = useState("");
  const [showPreviousOperation, setShowPreviousOperation] = useState(false);
  const [previousOperations, setPreviousOperations] = useState([]);
  const [previousOperationsLoading, setPreviousOperationsLoading] = useState(false);

  useEffect(() => {
    if (!user?.accessToken) {
      router.push("/");
    }
  }, [user, router]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const submitForm = async (event) => {
    event.preventDefault();
     if (!inputText) {
      toast.error("Please enter input for the task.");
      return;
    }
    if (!activeOperation) {
      toast.error("Please select an operation.");
      return;
    }

    const taskData = {
      input: inputText,
      operation: activeOperation,
    };

    setSteps([]);
    setOutput("");

    dispatch(signInStart());

    setSteps([{ text: "Sending data", done: false }]);
    await delay(1000);
    setSteps((prev) => [{ ...prev[0], done: true }]);

    setSteps((prev) => [...prev, { text: "Processing", done: false }]);
    await delay(1000);
    setSteps((prev) => {
      const updated = [...prev];
      updated[1].done = true;
      return updated;
    });

    const response = await performTask(taskData, user?.accessToken);

    setSteps((prev) => [...prev, { text: "Getting Result", done: false }]);
    await delay(1000);
    setSteps((prev) => {
      const updated = [...prev];
      updated[2].done = true;
      return updated;
    });

    setSteps((prev) => [...prev, { text: "Success", done: false }]);
    await delay(1000);

    if (response.success) {
      toast.success(response?.message);
      dispatch(performTaskSuccess());
      setSteps((prev) => {
        const updated = [...prev];
        updated[3].done = true;
        return updated;
      });
      setOutput(response?.data?.output || "");
      setInputText("");
      setActiveOperation(null);
    } else {
      toast.error(response.message);
      dispatch(performTaskFailure());
    }
  };

  const fetchPreviousOperation = async () => {
    if (!showPreviousOperation) {
      setShowPreviousOperation(true);
      setPreviousOperationsLoading(true);
      const result = await getAllTasks(user?.accessToken);
      if (result.success) {
        setPreviousOperations(result?.data);
      }
      setPreviousOperationsLoading(false);
    } else {
      setShowPreviousOperation(false);
    }
  };

  return (
    <div className="w-full px-5 md:px-0 bg-white h-auto dark:bg-[linear-gradient(to_bottom_right,#050A24_30%,#0E1B54_50%,#050A24_80%)]">
      <div className="flex flex-col gap-10 md:w-7xl mx-auto h-full">
        <div className="flex gap-10 w-full h-full">
          <div className="flex flex-col w-full gap-5 md:w-3/4">
            <p className="text-[40px] leading-12.5 mt-10 text-black font-medium dark:text-gray-200">Give your task</p>
            <form onSubmit={submitForm} className="flex flex-col gap-5 w-full">
              <textarea disabled={user?.loading} value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-72 px-6 py-5 rounded-2xl resize-none outline-none bg-gray-50 text-gray-800 border border-gray-200 shadow-lg transition-all duration-300 ease-in-out focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-slate-700/80 dark:text-gray-100 dark:border-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/30 dark:shadow-[0_15px_40px_rgba(0,0,0,0.7)] backdrop-blur-md" />
              <div className="flex gap-8 w-full items-center">
                {
                  operations?.map((operation) => (
                    <button key={operation?._id} type="button" disabled={user?.loading} onClick={()=>setActiveOperation(operation?.operationDo)} className={`w-full flex items-center justify-center py-1.5 rounded-md cursor-pointer ${activeOperation === operation?.operationDo ? "bg-yellow-500 text-black shadow-lg" : "bg-[#E6C97A]"} disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-500 disabled:hover:bg-gray-600`}>{operation?.title}</button>
                  ))
                }
              </div>
              <button disabled={user?.loading} type="submit" className="w-40 flex items-center justify-center py-2 rounded-md cursor-pointer text-white bg-[#0E1A53] dark:bg-[#050A24] disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-800 transition-all duration-300 disabled:hover:bg-gray-600">
                {user?.loading ? <Loader className="w-6 h-6 dark:text-white text-gray-700 animate-spin" /> : "Submit Task"}
              </button>
            </form>
          </div>
          <div className="w-full md:w-1/4 flex flex-col gap-2 mt-20">
            {
              steps?.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  {
                    step?.done? 
                    (
                      <div className="w-6 h-6 flex items-center justify-center bg-green-500 rounded-full p-1">
                        <Check className="w-full h-full text-white"/>
                      </div>
                    )
                    :
                    (
                      <div className="w-6 h-8 flex items-center justify-center">
                        <Loader className="w-full h-full animate-spin text-blue-500"/>
                      </div>
                    )
                  }
                  <span className="text-gray-700 dark:text-gray-200">{step?.text}</span>
                </div>
              ))
            }
            {
              output && (
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] leading-6.5 text-gray-500 mb-2">Output</p>
                  <p className="text-[16px] px-4 py-2 leading-6.5 font-medium h-80 overflow-y-auto bg-gray-100 transition-all duration-300 rounded-lg dark:bg-slate-700 text-gray-800 dark:text-gray-100">{output}</p>
                </div>
              )
            }
          </div>
        </div>
        <div className="flex flex-col gap-5 w-full h-full mb-2`0">
          <button type="button" disabled={user?.loading} onClick={fetchPreviousOperation} className="flex gap-10 w-full items-center cursor-pointer">
            <p className="text-[30px] leading-10 text-black font-medium dark:text-gray-200">Previous Operation</p>
            <div className="w-6 h-6 flex items-center justify-center">
              <ChevronDown className={`w-full h-full text-gray-300 dark:text-white transition-transform ${ showPreviousOperation ? "rotate-180" : "" }`} />
            </div>
          </button>
          {
            showPreviousOperation && <PreviousOperation previousOperationsLoading={previousOperationsLoading} previousOperations={previousOperations} />
          }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;