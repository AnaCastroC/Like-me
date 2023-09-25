import React from "react";

function Post({post: { id, titulo, url, descripcion, likes }, like, eliminarPost, urlBaseServer}){
  // variable para construir la url de la imagen  
  const imageUrl = `${urlBaseServer}/${url}`; 
  
  // variable para el icono de like
  const likeIcon = (
    <img
      src="https://icongr.am/fontawesome/heart.svg?size=20&color=currentColor"
      alt="Me Gusta"
      onClick={() => like(id)}
    />
  );

  return (
    <div className="card col-12 col-sm-4 d-inline mx-0 px-3">
      <div className="card-body d-flex flex-column">
        <div className="text-center mb-3">
          <img className="card-img-top" src={imageUrl} alt={titulo} />
        </div>
        <div>
          <h4 className="card-title">{titulo}</h4>
          <p className="card-text">{descripcion}</p>
        </div>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {likeIcon}
              <span className="ms-1">{likes}</span>
            </div>
            <button onClick={() => eliminarPost(id)} className="btn btn-danger">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;