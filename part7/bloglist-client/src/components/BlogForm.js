import React from 'react';
import { useDispatch } from 'react-redux';
import { createBlog } from '../actions/blogActions';
import {
  setNotification,
  unsetNotification,
} from '../actions/notificationActions';

const BlogForm = ({ user }) => {
  const dispatch = useDispatch();

  const addBlog = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const author = e.target.author.value;
    const url = e.target.url.value;
    dispatch(
      createBlog({
        title,
        author,
        url,
        likes: 0,
        user,
      })
    );
    dispatch(
      setNotification(`You added ${title} by ${author} to the bloglist`)
    );
    setTimeout(() => {
      dispatch(unsetNotification());
    }, 5000);
    e.target.title.value = '';
    e.target.author.value = '';
    e.target.url.value = '';
  };

  return (
    <form onSubmit={addBlog}>
      <h2>Create New</h2>
      <label>
        title:
        <input type="text" name="title" id="title" />
      </label>
      <label>
        author:
        <input type="text" name="author" id="author" />
      </label>
      <label>
        url:
        <input type="text" name="url" id="url" />
      </label>
      <button id="submit-btn" type="submit">
        Add
      </button>
    </form>
  );
};

export default BlogForm;
