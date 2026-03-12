"use client";
import { formatDateTime, headerData } from "@/Utils/Helper";
import React from "react";

const PreviousOperation = ({previousOperations, previousOperationsLoading}) => {console.log("previousOperations: ", previousOperations);
  return (
    <div className="w-full h-full">
        {
            previousOperationsLoading ? 
            (
                <div className=""></div>
            )
            :
            (
                <div className="w-full h-full overflow-x-auto border dark:border-gray-600 border-gray-300 rounded-xl">
                    <table className="w-full table-fixed">
                        <thead className="border-b-2 border-gray-300 dark:border-gray-600 w-full">
                            <tr className="w-full bg-white dark:bg-[#0b1739]">
                                {
                                  headerData?.map((header) => (
                                    <th key={header?._id} className="py-4 px-8 whitespace-nowrap">
                                      <span className="text-[14px] text-center leading-6 text-[#334155] dark:text-white font-semibold">{header?.title}</span>
                                    </th>
                                  ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                previousOperations?.map((operation, index) => (
                                    <tr key={operation?._id} className={`transition-all duration-300 hover:shadow-md hover:shadow-gray-300 dark:hover:shadow-black cursor-pointer hover:-translate-y-0.5 ${index % 2 === 0 ? "bg-gray-100 dark:bg-[#081028]" : "bg-white dark:bg-[#0b1739]"}`}>
                                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-medium text-black dark:text-gray-300">{operation?.operation}</td>
                                        <td className="py-1.5 px-5 text-center max-w-55 truncate text-[14px] leading-6 font-medium text-black dark:text-gray-300">
                                            <span title={operation?.input}>{operation?.input}</span>
                                        </td>
                                        <td className="py-1.5 px-5 text-center max-w-55 truncate text-[14px] leading-6 font-medium text-black dark:text-gray-300">
                                          <span title={operation?.output}>{operation?.output}</span>
                                        </td>
                                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-medium text-black dark:text-gray-300">{operation?.status}</td>
                                        <td className="py-1.5 px-5 text-center whitespace-nowrap text-[14px] leading-6 font-medium text-black dark:text-gray-300">{formatDateTime(operation?.createdAt)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    </div>
  );
};

export default PreviousOperation;
