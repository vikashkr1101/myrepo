<template>
    <section class="todo-list">
      <section class="greeting">
        <h2 class="title">
          What's up,
          <input
            type="text"
            id="name"
            placeholder="Name here"
            v-model="localName"
            @input="updateName"
          />
        </h2>
      </section>
      <h3>TODO LIST</h3>
      <h4>
        <em>Total Todos: </em>
        <span v-if="todos">{{ todos.length }}</span>
        <span v-else>0</span>
      </h4>
      <button class="btn" @click="goToAddTodo">Add Todo</button>
      <div class="list" v-if="todos.length">
        <div
          v-for="todo in todos"
          :key="todo.id"
          :class="['todo-item', todo.done ? 'done' : '']"
        >
          <label>
            <input
              type="checkbox"
              v-model="todo.done"
              @change="updateTodos(todo)"
            />
            <span :class="['bubble', todo.category]"></span>
          </label>
          <div class="todo-content">
            <input
              type="text"
              v-model="todo.content"
              @input="updateTodos(todo)"
            />
          </div>
          <div class="actions">
            <button class="delete" @click="deleteTodo(todo)">Delete</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No todos available. Add some!</p>
      </div>
    </section>
  </template>
  
  <script>
  import axios from "axios";
  
  const API_URL = "http://localhost:7020/api/Todo"; 
  
  export default {
    data() {
      return {
        todos: [],
        localName: localStorage.getItem("name") || "", 
        loading: true,
        error: null,
      };
    },
    created() {
      this.fetchTodos(); 
    },
    methods: {
      async fetchTodos() {
        this.loading = true;
        try {
          const response = await axios.get(API_URL); 
          this.todos = response.data; 
        } catch (error) {
          this.error = error; 
          console.error("Error fetching todos:", error);
        } finally {
          this.loading = false;
        }
      },
      async updateTodos(todo) {
        try {
          await axios.put(`${API_URL}/${todo.id}`, todo); // Ensure PUT request is correct
        } catch (error) {
          console.error("Error updating todo:", error);
        }
      },
      async deleteTodo(todo) {
        try {
          await axios.delete(`${API_URL}/${todo.id}`); // Correct DELETE request
          this.fetchTodos(); // Refresh todos after deletion
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      },
      goToAddTodo() {
        this.$router.push("/addtodo"); // Route to AddTodo page
      },
      updateName() {
        localStorage.setItem("name", this.localName); // Save name to localStorage
      },
    },
  };
  </script>
  