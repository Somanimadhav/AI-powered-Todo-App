"use client";
import { useState } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";

export default function Home() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // ✅ editing state

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

  const handleEdit = (index) => {
    setTodo(todos[index]);
    setEditIndex(index);
  };

  const handleUpdate = () => {
    if (todo.trim() !== "" && editIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = todo;
      setTodos(updatedTodos);
      setTodo("");
      setEditIndex(null);
    }
  };

  // ✅ Copilot Action: Add Todo
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

  // ✅ Copilot Action: Delete Todo
  useCopilotAction({
    name: "deleteTodoItem",
    description: "Delete a todo item from the list",
    parameters: [
      {
        name: "todoIndex",
        type: "string",
        description: "Index of the todo item to delete",
        required: true,
      },
    ],
    handler: async ({ todoIndex }) => {
      handleDelete(Number(todoIndex));
      return `Deleted todo at index ${todoIndex}`;
    },
  });

  // ✅ Copilot Action: Edit Todo
  useCopilotAction({
    name: "editTodoItem",
    description: "Edit a todo item in the list",
    parameters: [
      {
        name: "todoIndex",
        type: "string",
        description: "Index of the todo item to edit",
        required: true,
      },
      {
        name: "newText",
        type: "string",
        description: "New text to replace the todo item with",
        required: true,
      },
    ],
    handler: async ({ todoIndex, newText }) => {
      const index = Number(todoIndex);
      if (!isNaN(index) && todos[index]) {
        const updatedTodos = [...todos];
        updatedTodos[index] = newText;
        setTodos(updatedTodos);
        return `Updated todo at index ${index} to "${newText}"`;
      }
      return `Invalid index or todo item does not exist.`;
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

          {editIndex !== null ? (
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-all"
            >
              Update Todo
            </button>
          ) : (
            <button
              onClick={() => handleAdd(todo)}
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-all"
            >
              Add Todo
            </button>
          )}
        </div>

        {todos.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {todos.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-md p-3"
              >
                <span className="text-gray-800 break-words">{item}</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-yellow-500 hover:text-yellow-700 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
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
