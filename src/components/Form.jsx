function Form({ setTitulo, setImagen, setDescripcion, agregarPost }) {
  return (
    <div className="form">
      <div className="mb-2">
        <h6>Agregar post</h6>
        <label>Título</label>
        <input
          onChange={(event) => setTitulo(event.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-2">
        <label>URL de la imagen</label>
        <input
          onChange={(event) => setImagen(event.target.files[0])} // files[0] porque es un array y necesitamos el primer elemento
          className="form-control"
          name = "img"
          type="file"
          accept="image/*" 
        />
      </div>
      <div className="mb-3">
        <label>Descripción</label> <br />
        <textarea
          onChange={(event) => setDescripcion(event.target.value)}
          className="form-control"
        ></textarea>
      </div>
      <div className="d-flex">
        <button onClick={agregarPost} className="btn btn-warning m-auto">
          Agregar
        </button>
      </div>
    </div>
  );
}

export default Form;
