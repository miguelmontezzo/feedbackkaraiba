export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-red-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <img
          src={encodeURI("/Karaiba branco t- Oclo.png")}
          alt="Karaíba"
          className="mx-auto h-32 w-auto mb-6"
          loading="eager"
        />
        <p className="text-lg">Obrigado pela preferência.</p>
      </div>
    </div>
  );
}

