import { useState, useEffect } from 'react';

function App() {
  const [mesa, setMesa] = useState('');
  const [cliente, setCliente] = useState('');
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState({}); // { productoId: cantidad }
  const [pedidos, setPedidos] = useState([]);

  // cargar productos (la carta) y pedidos activos al iniciar
  const cargarDatos = async () => {
    try {
      const resProd = await fetch('http://localhost:4000/api/productos');
      const dataProd = await resProd.json();
      setProductos(dataProd);

      const resPed = await fetch('http://localhost:4000/api/pedidos');
      const dataPed = await resPed.json();
      setPedidos(dataPed);
    } catch (error) {
      console.error('error al cargar datos:', error);
    }
  };

  useEffect(() => {
    let cancelado = false;

    const cargarDatosIniciales = async () => {
      try {
        const resProd = await fetch('http://localhost:4000/api/productos');
        const dataProd = await resProd.json();

        if (!cancelado) {
          setProductos(dataProd);
        }

        const resPed = await fetch('http://localhost:4000/api/pedidos');
        const dataPed = await resPed.json();

        if (!cancelado) {
          setPedidos(dataPed);
        }
      } catch (error) {
        if (!cancelado) {
          console.error('error al cargar datos:', error);
        }
      }
    };

    void cargarDatosIniciales();

    return () => {
      cancelado = true;
    };
  }, []);

  // manejar la cantidad de cada producto seleccionado
  const manejarCantidad = (productoId, cantidad) => {
    const cant = parseInt(cantidad) || 0;
    setSeleccionados(prev => {
      if (cant <= 0) {
        const copia = { ...prev };
        delete copia[productoId];
        return copia;
      }
      return { ...prev, [productoId]: cant };
    });
  };

  // calcular el subtotal o total en tiempo real para mostrar en pantalla
  const calcularTotalPreview = () => {
    let total = 0;
    for (const [id, cantidad] of Object.entries(seleccionados)) {
      const prod = productos.find(p => p._id === id);
      if (prod) {
        total += prod.precio * cantidad;
      }
    }
    return total;
  };

  // enviar la comanda al backend
  const crearPedido = async (e) => {
    e.preventDefault();
    if (!mesa || !cliente || Object.keys(seleccionados).length === 0) {
      alert('completá la mesa, el cliente y elegí al menos un producto');
      return;
    }

    const items = Object.entries(seleccionados).map(([productoId, cantidad]) => ({
      productoId,
      cantidad
    }));

    try {
      const respuesta = await fetch('http://localhost:4000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mesa: Number(mesa),
          cliente,
          items
        }),
      });

      if (respuesta.ok) {
        setMesa('');
        setCliente('');
        setSeleccionados({});
        cargarDatos();
      }
    } catch (error) {
      console.error('error al crear pedido:', error);
    }
  };

  // cambiar el estado del pedido
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const respuesta = await fetch(`http://localhost:4000/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (respuesta.ok) {
        cargarDatos();
      }
    } catch (error) {
      console.error('error al cambiar estado:', error);
    }
  };

  return (
    <div style={{ padding: '25px', fontFamily: 'sans-serif', maxWidth: '2500px', margin: 'auto' }}>
      <h1>Comandita</h1>

      {/* formulario para nueva comanda */}
      <form onSubmit={crearPedido} style={{ background: '#11121d', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Nueva Comanda</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Nº de Mesa"
            value={mesa}
            onChange={(e) => setMesa(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
          <input
            type="text"
            placeholder="Nombre del Cliente"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            style={{ padding: '8px', flex: 2 }}
          />
        </div>

        <h4>Carta / Menú</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
          {productos.map((prod) => (
            <div key={prod._id} style={{ background: '#154f21', padding: '10px', border: '1px solid #020202', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{prod.nombre}</strong>
                <br />
                <small>${prod.precio} ({prod.categoria})</small>
              </div>
              <input
                type="number"
                min="0"
                value={seleccionados[prod._id] || ''}
                onChange={(e) => manejarCantidad(prod._id, e.target.value)}
                placeholder="cant"
                style={{ width: '50px', padding: '6px' }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Total estimado: ${calcularTotalPreview()}</strong>
          <button type="submit" style={{ padding: '10px 20px', background: '#187be5', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
            Enviar Comanda
          </button>
        </div>
      </form>

      {/* lista de pedidos activos */}
      <h2>Pedidos Activos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos cargados.</p>
      ) : (
        <ul>
          {pedidos.map((p) => (
            <li key={p._id} style={{ background: '#2a3b4d', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div>
                <strong>Mesa {p.mesa}</strong> - Cliente: <strong>{p.cliente}</strong>
                <br />
                <ul>
                  {p.items.map((item, idx) => (
                    <li key={idx}>
                      {item.cantidad}x {item.producto ? item.producto.nombre : 'Producto eliminado'} (${item.producto ? item.producto.precio * item.cantidad : 0})
                    </li>
                  ))}
                </ul>
                <strong>Importe Total: ${p.total}</strong>
                <br />
                <em>Estado: <strong>{p.estado}</strong></em>
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                <button onClick={() => cambiarEstado(p._id, 'en preparación')} style={{ padding: '4px 8px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>
                  En preparación
                </button>
                <button onClick={() => cambiarEstado(p._id, 'entregado')} style={{ padding: '4px 8px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Entregado
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