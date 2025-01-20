import { mount } from '@vue/test-utils';
import TodoList from '../TodoList.vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const mock = new MockAdapter(axios);
const API_URL = "http://localhost:7020/api/Todo";

describe('TodoList.vue', () => {
  beforeEach(() => {
   
    mock.onGet(API_URL).reply(200, [
      { id: 1, content: 'Learn Vue Testing', done: false, category: 'work' },
      { id: 2, content: 'Set up Jest', done: true, category: 'personal' }
    ]);

    mock.onPut(`${API_URL}/1`).reply(200);
    mock.onDelete(`${API_URL}/1`).reply(200);
  });

  afterEach(() => {
    mock.reset();
  });

  it('fetches and displays todos from the API', async () => {
    const wrapper = mount(TodoList);
    await wrapper.vm.$nextTick(); 

    const todoItems = wrapper.findAll('.todo-item');
    expect(todoItems.length).toBe(2);
    expect(todoItems[0].text()).toContain('Learn Vue Testing');
    expect(todoItems[1].text()).toContain('Set up Jest');
  });

  it('marks a todo as done and sends a PUT request', async () => {
    const wrapper = mount(TodoList);
    await wrapper.vm.$nextTick(); 

    const checkbox = wrapper.findAll('input[type="checkbox"]').at(0);
    await checkbox.setChecked();
    await wrapper.vm.$nextTick();

    expect(mock.history.put.length).toBe(1);
    expect(mock.history.put[0].data).toContain('"done":true');
  });

  it('deletes a todo and sends a DELETE request', async () => {
    const wrapper = mount(TodoList);
    await wrapper.vm.$nextTick(); 

    const deleteButton = wrapper.find('.delete');
    await deleteButton.trigger('click');

    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(`${API_URL}/1`);
  });

  it('navigates to the Add Todo page when Add Todo button is clicked', async () => {
    const wrapper = mount(TodoList, {
      global: {
        mocks: {
          $router: {
            push: jest.fn()
          }
        }
      }
    });

    const button = wrapper.find('.btn');
    await button.trigger('click');

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/addtodo');
  });
});
