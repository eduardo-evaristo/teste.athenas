export function Container({ children }) {
  return (
    <div className="container-xxl bg-primary p-5 rounded shadow min-vh-80 my-4">
      {children}
    </div>
  );
}

export function ContainerTarefa({ children }) {
  return <div className="container my-4 d-flex flex-column">{children}</div>;
}
