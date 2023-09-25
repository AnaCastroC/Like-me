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

  // función para obtener los posts con método get
  const getPosts = async () => {
    const { data: posts } = await axios.get(urlBaseServer + "/posts");
    setPosts([...posts]); // abrimos el arreglo de posts y lo pasamos como argumento al estado
  };

  // función para agregar un post con método post
  const agregarPost = async () => {
    const formData = new FormData(); // FormData es una clase de JS que permite crear un objeto de tipo formulario
    formData.append("titulo", titulo); // append: agrega un nuevo valor al formulario
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

  // función para dar like a un post con método put
  const like = async (id) => { // id viene del componente Post como argumento de post.like
    await axios.put(urlBaseServer + `/posts/like/${id}`);
    getPosts();
  };

  // función para eliminar un post con método delete
  const eliminarPost = async (id) => {
    await axios.delete(urlBaseServer + `/posts/${id}`);
    getPosts();
  };
  useEffect(() => { // useEffect se ejecuta cuando el componente se monta
    getPosts(); // llamamos a la función getPosts
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
              post={post} // a través del prop post accedemos a id, titulo, url, descripcion, likes
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