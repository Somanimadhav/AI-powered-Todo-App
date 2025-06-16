"use client";
import { useState } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const handleAdd = (todoText) => {
    if (todoText.trim() !== "") {
      setTodos((prevTodos) => [...prevTodos, todoText]);
      setTodo("");
    }
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  // Copilot Action: Add Todo
  useCopilotAction({
    name: "addTodoItem",
    description: "Add a new todo item to the list",
    parameters: [
      {
        name: "todoText",
        type: "string",
        description: "The text of the todo item to add",
        required: true,
      },
    ],
    handler: async ({ todoText }) => {
      handleAdd(todoText);
      return `Added "${todoText}" to the list.`;
    },
  });

  // Copilot Action: Delete Todo by Index
  useCopilotAction({
    name: "deleteTodoItem",
    description: "Delete a todo item from the list",
    parameters: [
      {
        name: "todoIndex",
        type: "string", // Copilot sends as string
        description: "Index of the todo item to delete",
        required: true,
      },
    ],
    handler: async ({ todoIndex }) => {
      handleDelete(Number(todoIndex));
      return `Deleted todo at index ${todoIndex}`;
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          ✅ Welcome to iTodo
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <textarea
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Write your todo here..."
            rows="2"
            className="flex-1 w-full md:w-auto resize-none p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>

          <button
            onClick={() => handleAdd(todo)}
            className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-all"
          >
            Add Todo
          </button>
        </div>

        {todos.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {todos.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-md p-3"
              >
                <span className="text-gray-800 break-words">{item}</span>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-gray-500 text-center">No todos yet!</p>
        )}
      </div>

      <CopilotPopup
        instructions={
          "You are assisting the user as best as you can. Answer in the best way possible given the data you have."
        }
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </main>
  );
}
