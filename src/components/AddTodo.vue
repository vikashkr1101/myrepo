<template>
    <section class="create-todo">
      <h2>CREATE A TODO</h2>
      <form @submit.prevent="addTodo">
          <br>
        <h3>What's on your todo list?</h3>
        <input
          type="text"
          v-model="input_content"
          placeholder="e.g. Make a video"
          required
        />
  
        <h3>Pick a category</h3>
        <div class="options">
          <label>
            <input
              type="radio"
              name="category"
              value="business"
              v-model="input_category"
            />
            <span class="bubble business"></span>
            <div>Business</div>
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="personal"
              v-model="input_category"
            />
            <span class="bubble personal"></span>
            <div>Personal</div>
          </label>
        </div>
  
        <input type="submit" value="Add todo" />
      </form>
      <button class="btn" @click="goToTodoList">Back to Todo List</button>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  import { v4 as uuidv4 } from 'uuid';
  const API_URL = 'http://localhost:7020/api/Todo'; // Define API URL here
  const DONESTATUS_API_URL = 'http://localhost:7020/api/DoneStatus';
  
  export default {
    props: ['todos'],
    data() {
      return {
        input_content: '',
        input_category: null,
      };
    },
    methods: {
      async addTodo() {
        if (this.input_content.trim() === '' || !this.input_category) {
          return;
        }
  
        try {
          // Determine CategoryId based on the input_category
          let categoryId = this.input_category === 'business' ? 1 : 2;
  
          // Get the DoneId for "created" status
          const doneResponse = await axios.get(`${DONESTATUS_API_URL}?status=created`);
          let doneId;
  
          if (doneResponse.data.length === 0) {
            // Create the done status if it doesn't exist
            const newDoneStatus = { Status: 'created', CreatedAt: new Date().toISOString(), UpdatedAt: new Date().toISOString() };
            const doneCreateResponse = await axios.post(DONESTATUS_API_URL, newDoneStatus);
            doneId = doneCreateResponse.data.DoneId;
          } else {
            doneId = doneResponse.data[0].DoneId;
          }
  
          // Add the new todo
          const newTodo = {
            Content: this.input_content,
            Created: new Date().toISOString(),
            CategoryId: categoryId,
            CreatedBy: 'User', // Replace with dynamic user ID if available
            DoneId: doneId,
          };
  
          await axios.post(API_URL, newTodo);
  
          this.input_content = '';
          this.input_category = null;
          this.goToTodoList();
        } catch (error) {
          console.error('Error creating todo:', error);
        }
      },
      goToTodoList() {
        console.log('Redirecting to TodoList page...');
        this.$router.push('/');
      },
    },
  };
  </script>
  