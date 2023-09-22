import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./components/Form";
import Post from "./components/Post";

const urlBaseServer = "http://localhost:5000";

function App() {
  const [titulo, setTitulo] = useState("");
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const { data: posts } = await axios.get(urlBaseServer + "/posts");
    setPosts([...posts]);
  };

  const agregarPost = async () => {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("img", imagen);
    formData.append("descripcion", descripcion);

    try {
      await axios.post(urlBaseServer + "/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      getPosts();
    } catch (error) {
      console.error("Error al agregar el post:", error);
    }
  };

  const like = async (id) => {
    await axios.put(urlBaseServer + `/posts/like/${id}`);
    getPosts();
  };

  const eliminarPost = async (id) => {
    await axios.delete(urlBaseServer + `/posts/${id}`);
    getPosts();
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <h2 className="py-5 text-center">&#128248; Like Me &#128248;</h2>
      <div className="row m-auto px-5">
        <div className="col-12 col-sm-4">
          <Form
            setTitulo={setTitulo}
            setImagen={setImagen}
            setDescripcion={setDescripcion}
            agregarPost={agregarPost}
          />
        </div>
        <div className="col-12 col-sm-8 px-5 row posts align-items-start">
          {posts.map((post, i) => (
            <Post
              key={i}
              post={post}
              like={like}
              eliminarPost={eliminarPost}
              urlBaseServer={urlBaseServer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;