import { useState, useEffect } from 'react';

function App() {
  const [mesa, setMesa] = useState('');
  const [plato, setPlato] = useState('');
  const [pedidos, setPedidos] = useState([]);

  const obtenerPedidos = async () => {
    try {
      const respuesta = await fetch('http://localhost:4000/api/pedidos');
      const datos = await respuesta.json();
      setPedidos(datos);
    } catch (error) {
      console.error('error al cargar pedidos:', error);
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await obtenerPedidos();
    };
    cargarDatos();
  }, []);

  const crearPedido = async (e) => {
    e.preventDefault();
    if (!mesa || !plato) return;

    try {
      const respuesta = await fetch('http://localhost:4000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesa: Number(mesa),
          platos: [plato]
        }),
      });

      if (respuesta.ok) {
        setMesa('');
        setPlato('');
        obtenerPedidos();
      }
    } catch (error) {
      console.error('error al crear pedido:', error);
    }
  };

  // función para cambiar el estado del pedido
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const respuesta = await fetch(`http://localhost:4000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (respuesta.ok) {
        obtenerPedidos();
      }
    } catch (error) {
      console.error('error al cambiar estado:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Comandero de Restaurante</h1>

      {/* formulario */}
      <form onSubmit={crearPedido} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="number"
          placeholder="número de mesa"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <input
          type="text"
          placeholder="descripción del plato"
          value={plato}
          onChange={(e) => setPlato(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
          enviar comanda
        </button>
      </form>

      {/* lista de pedidos */}
      <h2>pedidos activos</h2>
      {pedidos.length === 0 ? (
        <p>no hay pedidos cargados.</p>
      ) : (
        <ul>
          {pedidos.map((p) => (
            <li key={p._id} style={{ background: '#f8f9fa', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div>
                <strong>mesa {p.mesa}</strong> - {p.platos.join(', ')} 
                <br />
                <em>estado: <strong>{p.estado}</strong></em>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                <button onClick={() => cambiarEstado(p._id, 'en preparación')} style={{ padding: '4px 8px', background: '#cba741', border: 'none', cursor: 'pointer' }}>
                  en preparación
                </button>
                <button onClick={() => cambiarEstado(p._id, 'entregado')} style={{ padding: '4px 8px', background: '#1e7432', color: 'white', border: 'none', cursor: 'pointer' }}>
                  entregado
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;