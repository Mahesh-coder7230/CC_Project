
const Footer = () => (
  <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">MENSWEAR</p>
        <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Thoughtful essentials and considered layers for everyday style.</p>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h2>
        <a className="mt-4 block text-sm hover:text-amber-400" href="tel:+912200700700">+91 22 0070 0700</a>
        <a className="mt-2 block text-sm hover:text-amber-400" href="mailto:support@younique.in">support@younique.in</a>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Visit us</h2>
        <p className="mt-4 text-sm leading-6 text-slate-400">Shop 09, Kasturi Heights 06,<br />Indralok Phase 4, Bandra West,<br />Maharashtra 400050</p>
      </div>
    </div>
    <div className="border-t border-slate-800 px-6 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} Younique. All rights reserved.</div>
  </footer>
)

export default Footer
