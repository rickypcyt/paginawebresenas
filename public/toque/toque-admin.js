/*!
 * <toque-admin> — Vista "Admin" de Toque como Web Component aislado (Shadow DOM).
 *
 *   import './toque-admin.js';
 *   const el = document.querySelector('toque-admin');
 *   el.data  = { me, db:{users,businesses,employees,tags,requests,payments,categories}, reviews, taps };   // ver README
 *   el.hooks = { approveRequest, rejectRequest, saveUser, deleteUser, saveBusiness, verifyBusiness, deleteBusiness,
 *                saveEmployee, toggleEmployee, deleteEmployee, toggleTag, saveTag, saveReview, deleteReview,
 *                deletePayment, getNfcLink };
 *   el.addEventListener('toque:logout', ...);
 *
 * Sin `data` muestra datos de ejemplo. Atributo `hide-header` oculta la barra superior propia.
 * No toca el CSS ni el JS global de la página donde se use.
 */
const CSS = `:host{all:initial;display:block}

  :host{--ink:#1d1d1f;--muted:#6e6e73;--line:#e8e8ed;--line2:#d2d2d7;--band:#f5f5f7;--bg:#fff;--green:#22c55e;--gdark:#15803d;--gsoft:#f0fdf4;--amber:#b45309;--asoft:#fffbeb;--red:#dc2626;--star:#e7b53c;--rsoft:#fef2f2;--surface:#fff;--surface2:#fafafa;--glass:rgba(255,255,255,.9);--gline:#bbf7d0;--rline:#fecaca;--bad:#f87171;--bad-ink:#b91c1c;--neutral:#d1d1d6;--faint:#c7c7cc;--star-off:#e5e5ea;--glow1:rgba(34,197,94,.09);--glow2:rgba(34,197,94,.05);
    --font:"Geist",-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  *{box-sizing:border-box;margin:0;padding:0}
  [hidden]{display:none!important}
  .app{background:var(--bg);color:var(--ink);font-family:var(--font);-webkit-font-smoothing:antialiased;font-size:14px;line-height:normal;text-align:left}
  button,input,select,textarea{font-family:inherit;font-size:inherit;color:inherit}
  button{cursor:pointer}
  :focus-visible{outline:2px solid var(--green);outline-offset:2px}
  svg.i{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}

  /* barra superior */
  .top{position:sticky;top:0;z-index:20;height:60px;display:flex;align-items:center;gap:12px;padding:0 20px;background:var(--glass);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
  .logo{display:flex;align-items:center;gap:7px;font-weight:700;font-size:19px;letter-spacing:-.03em;color:var(--ink);text-decoration:none}
  .logo svg{width:24px;height:24px}
  .top .sp{flex:1}
  .pill{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 12px;border:1px solid var(--line2);border-radius:100px;font-size:13px;font-weight:500;background:var(--surface)}
  .pill svg{width:15px;height:15px;color:var(--gdark)}
  .me{display:flex;align-items:center;gap:9px;height:34px;padding:0 4px 0 12px;border-radius:100px;background:var(--band);font-size:13px;font-weight:500;max-width:220px}
  .me span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .av{width:26px;height:26px;border-radius:50%;background:var(--green);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:600;flex-shrink:0}
  .icon-btn{width:34px;height:34px;border-radius:50%;border:1px solid var(--line2);background:var(--surface);display:grid;place-items:center;color:var(--muted)}
  .icon-btn:hover{color:var(--ink)}

  /* estructura */
  .shell{display:grid;grid-template-columns:232px 1fr;min-height:calc(100vh - 60px)}
  .side{border-right:1px solid var(--line);padding:18px 12px;position:sticky;top:60px;height:calc(100vh - 60px)}
  .side small{display:block;font-size:11px;font-weight:600;color:var(--muted);letter-spacing:.04em;text-transform:uppercase;padding:0 10px 8px}
  .nav{display:flex;flex-direction:column;gap:2px}
  .nav button{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 10px;border:none;background:none;border-radius:9px;font-weight:500;color:var(--muted);text-align:left;transition:background .15s,color .15s}
  .nav button:hover{background:var(--band);color:var(--ink)}
  .nav button.on{background:var(--band);color:var(--ink);font-weight:600}
  .nav button.on svg{color:var(--gdark)}
  .nav .cnt{margin-left:auto;min-width:22px;height:20px;padding:0 6px;border-radius:100px;background:var(--surface);border:1px solid var(--line);font-size:11.5px;font-weight:600;color:var(--muted);display:grid;place-items:center}
  .nav .cnt.hot{background:var(--green);border-color:var(--green);color:#fff}
  .main{padding:28px 32px 60px;min-width:0}
  .wrap{max-width:1040px}

  .head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:22px;flex-wrap:wrap}
  .head p{font-size:13px;color:var(--muted);margin-top:3px}
  h1{font-size:26px;font-weight:650;letter-spacing:-.03em}
  h2{font-size:15px;font-weight:600;letter-spacing:-.01em}
  .btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;border-radius:10px;border:1px solid var(--line2);background:var(--surface);font-weight:500;font-size:13px;white-space:nowrap;transition:background .15s,border-color .15s}
  .btn:hover{background:var(--band)}
  .btn svg{width:15px;height:15px}
  .btn.go{background:var(--green);border-color:var(--green);color:#fff;font-weight:600}
  .btn.go:hover{background:#16a34a;border-color:#16a34a}
  .btn.sm{height:30px;padding:0 10px;font-size:12.5px;border-radius:8px}
  .btn.ghost{border-color:transparent;background:none;color:var(--muted)}
  .btn.ghost:hover{background:var(--band);color:var(--ink)}
  .btn.del{color:var(--red)}
  .btn.del:hover{background:var(--rsoft);border-color:var(--rline)}

  /* KPIs */
  .kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:26px}
  .kpi{border:1px solid var(--line);border-radius:14px;padding:14px 16px;background:var(--surface);text-align:left;transition:border-color .15s,box-shadow .15s}
  button.kpi:hover{border-color:var(--line2);box-shadow:0 4px 14px -8px rgba(0,0,0,.15)}
  .kpi span{display:block;font-size:12.5px;color:var(--muted);font-weight:500}
  .kpi b{display:block;font-size:28px;font-weight:650;letter-spacing:-.03em;margin-top:6px;font-variant-numeric:tabular-nums}

  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .card{border:1px solid var(--line);border-radius:16px;background:var(--surface);overflow:hidden}
  .card-h{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid var(--line)}
  .card-h .lk{margin-left:auto;border:none;background:none;color:var(--gdark);font-size:13px;font-weight:500}
  .card-h .lk:hover{text-decoration:underline}
  .empty{padding:34px 18px;text-align:center;color:var(--muted);font-size:13px}
  .empty svg{width:28px;height:28px;color:var(--faint);margin-bottom:8px}
  .empty b{display:block;color:var(--ink);font-weight:600;font-size:14px;margin-bottom:2px}

  /* filas */
  .row{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--line)}
  .row:last-child{border-bottom:none}
  .row .who{min-width:0;flex:1}
  .row .who b{display:block;font-weight:600;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row .who span{display:block;color:var(--muted);font-size:12.5px;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row .acts{display:flex;gap:6px;flex-shrink:0;align-items:center}
  .ini{width:34px;height:34px;border-radius:50%;background:var(--band);display:grid;place-items:center;font-size:12.5px;font-weight:600;flex-shrink:0;color:var(--ink)}
  .ini.biz{border-radius:10px;background:var(--gsoft);color:var(--gdark)}
  .tag{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:100px;font-size:11.5px;font-weight:600;background:var(--band);color:var(--muted);white-space:nowrap}
  .tag.g{background:var(--gsoft);color:var(--gdark)}
  .tag.a{background:var(--asoft);color:var(--amber)}
  .tag.r{background:var(--rsoft);color:var(--red)}
  .tag.off{background:var(--rsoft);color:var(--red)}

  /* buscador y filtros */
  .tools{display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
  .search{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;height:38px;padding:0 12px;border:1px solid var(--line2);border-radius:10px;background:var(--surface)}
  .search svg{width:16px;height:16px;color:var(--muted)}
  .search input{border:none;outline:none;flex:1;background:none;min-width:0}
  .seg{display:inline-flex;background:var(--band);border-radius:10px;padding:3px;gap:2px;max-width:100%;overflow-x:auto;scrollbar-width:none}
  .seg::-webkit-scrollbar{display:none}
  .seg button{border:none;background:none;height:32px;padding:0 12px;border-radius:8px;font-size:13px;font-weight:500;color:var(--muted);white-space:nowrap}
  .seg button.on{background:var(--surface);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.08)}

  /* grupos de usuarios */
  .group{margin-bottom:12px}
  .group-h{display:flex;align-items:center;gap:10px;width:100%;padding:12px 18px;border:none;background:var(--surface);text-align:left}
  .group-h .ini{width:30px;height:30px;font-size:12px}
  .group-h b{font-size:14px;font-weight:600}
  .group-h small{color:var(--muted);font-size:12.5px;margin-left:2px}
  .group-h .chev{margin-left:auto;color:var(--muted);transition:transform .2s}
  .group.closed .chev{transform:rotate(-90deg)}
  .group.closed .group-b{display:none}
  .group-b{border-top:1px solid var(--line)}

  /* negocio */
  .biz-card{display:flex;align-items:center;gap:14px;padding:16px 18px;border:none;background:var(--surface);width:100%;text-align:left}
  .biz-card:hover{background:var(--surface2)}
  .biz-card .ini{width:44px;height:44px;font-size:16px}
  .biz-card .meta{display:flex;gap:14px;flex-wrap:wrap;color:var(--muted);font-size:12.5px;margin-top:3px}
  .back{display:inline-flex;align-items:center;gap:6px;border:none;background:none;color:var(--muted);font-weight:500;margin-bottom:14px}
  .back:hover{color:var(--ink)}
  .stats{display:flex;gap:28px;flex-wrap:wrap}
  .stats div b{display:block;font-size:20px;font-weight:650;letter-spacing:-.02em}
  .stats div span{font-size:12px;color:var(--muted)}
  .nfc{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12px;color:var(--muted)}
  .nfc code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;background:var(--band);padding:3px 7px;border-radius:6px}
  .switch{position:relative;width:34px;height:20px;border-radius:100px;background:var(--neutral);border:none;transition:background .2s;flex-shrink:0}
  .switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .2s}
  .switch.on{background:var(--green)}
  .switch.on::after{transform:translateX(14px)}

  /* tabla pagos */
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  th{text-align:left;font-size:12px;font-weight:600;color:var(--muted);padding:11px 18px;border-bottom:1px solid var(--line);background:var(--surface2)}
  td{padding:12px 18px;border-bottom:1px solid var(--line)}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}

  /* modal */
  .scrim{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.28);display:grid;place-items:center;padding:16px;animation:fade .15s ease}
  .modal{width:100%;max-width:420px;background:var(--surface);border-radius:18px;box-shadow:0 30px 60px -20px rgba(0,0,0,.35);animation:up .2s ease}
  .modal header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--line)}
  .modal form{padding:18px 20px;display:flex;flex-direction:column;gap:12px}
  .modal label{display:flex;flex-direction:column;gap:5px;font-size:12.5px;font-weight:500;color:var(--muted)}
  .modal input,.modal select{height:40px;border:1px solid var(--line2);border-radius:10px;padding:0 12px;background:var(--surface);color:var(--ink);font-size:14px}
  .modal input:focus,.modal select:focus{outline:none;border-color:var(--green)}
  .modal label.chk{flex-direction:row;align-items:center;gap:8px;color:var(--ink)}
  .modal label.chk input{height:auto}
  .modal footer{display:flex;justify-content:flex-end;gap:8px;padding:0 20px 18px}
  .modal p.q{padding:18px 20px;color:var(--muted);line-height:1.5}
  .modal p.q b{color:var(--ink)}
  @keyframes fade{from{opacity:0}}
  @keyframes up{from{opacity:0;transform:translateY(8px)}}
  .toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:60;background:var(--ink);color:#fff;padding:10px 16px;border-radius:12px;font-size:13px;font-weight:500;box-shadow:0 10px 30px -10px rgba(0,0,0,.4);animation:up .2s ease}

  /* responsive */
  @media(max-width:1100px){.kpis{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:860px){
    .shell{grid-template-columns:1fr}
    .side{position:fixed;top:auto;bottom:0;left:0;right:0;height:auto;z-index:30;border-right:none;border-top:1px solid var(--line);background:var(--glass);backdrop-filter:blur(12px);padding:6px 6px calc(6px + env(safe-area-inset-bottom))}
    .side small{display:none}
    .nav{flex-direction:row;justify-content:space-around;flex-wrap:wrap}
    .nav button{flex-direction:column;height:52px;gap:3px;font-size:10.5px;justify-content:center;padding:0 4px;position:relative;flex:1 1 calc(20% - 4px)}
    .nav button .lbl-l{display:none}
    .nav button.mobile-extra{display:none}
    .nav button.mobile-extra.on,.nav.more-open button.mobile-extra{display:flex}
    .nav-more{display:flex!important}
    .nav.more-open .nav-more svg{transform:rotate(45deg)}
    .nav .cnt{position:absolute;top:3px;left:calc(50% + 6px);margin:0;height:17px;min-width:17px;font-size:10px;padding:0 4px}
    .nav .cnt:not(.hot){display:none}
    .main{padding:20px 16px 96px}
    .top{padding:0 16px}
    .me span,.pill .t{display:none}
    .me{padding:0 4px}
    .pill{padding:0 9px}
    .grid2{grid-template-columns:1fr}
    .kpis{grid-template-columns:repeat(2,1fr);gap:10px}
    h1{font-size:22px}
    .row{flex-wrap:wrap}
    .row .acts{width:100%;justify-content:flex-start;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:none;padding-bottom:2px}
    .row .acts::-webkit-scrollbar{display:none}
    .row .acts>*{flex:0 0 auto}
    .row .acts.inline{width:auto}
    table{display:block;max-width:100%;overflow-x:auto;white-space:nowrap;scrollbar-width:thin}
    .tbl-wrap{display:none}
    .pay-cards{display:block!important}
  }
  .lbl-s,.nav-more{display:none}
  @media(max-width:860px){.lbl-s{display:inline}}
  .pay-cards{display:none}
  .demo-tag{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:100px;font-size:11px;font-weight:600;background:var(--band);color:var(--muted);margin-left:8px;vertical-align:middle;letter-spacing:0}
  .kpi small{display:block;font-size:11.5px;margin-top:4px;color:var(--muted);font-weight:500}
  .kpi small.up{color:var(--gdark)}.kpi small.down{color:var(--red)}
  .kpi b .st{display:inline;color:var(--star);font-size:20px;margin-left:2px}
  .grid3{display:grid;grid-template-columns:1.25fr 1fr;gap:16px;margin-bottom:16px}
  .pad{padding:16px 18px}
  /* gráfico */
  .chart{display:flex;align-items:flex-end;gap:10px;height:150px;padding:6px 2px 0}
  .chart .col{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;min-width:0}
  .chart .bar{width:100%;max-width:38px;display:flex;flex-direction:column-reverse;border-radius:7px;overflow:hidden;background:var(--band)}
  .chart .bar i{display:block}
  .chart .col span{font-size:11px;color:var(--muted);white-space:nowrap}
  .legend{display:flex;gap:14px;font-size:12px;color:var(--muted);margin-top:12px;flex-wrap:wrap}
  .legend i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  /* distribución */
  .dist{display:flex;flex-direction:column;gap:9px}
  .dist div{display:flex;align-items:center;gap:10px;font-size:12.5px}
  .dist em{font-style:normal;width:26px;color:var(--muted);font-variant-numeric:tabular-nums}
  .dist .tr{flex:1;height:8px;border-radius:100px;background:var(--band);overflow:hidden}
  .dist .tr i{display:block;height:100%;border-radius:100px;background:var(--star)}
  .dist b{width:30px;text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
  /* ratio buenas/malas */
  .ratio{display:flex;height:10px;border-radius:100px;overflow:hidden;background:var(--band)}
  .ratio i{display:block;height:100%}
  .ratio-l{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-top:7px}
  /* top 3 */
  .podium{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:end}
  .pod{border:1px solid var(--line);border-radius:14px;padding:14px 10px 12px;text-align:center;background:var(--surface)}
  .pod.first{border-color:var(--gline);background:linear-gradient(var(--surface),var(--gsoft))}
  .pod .ini{width:42px;height:42px;margin:0 auto 8px;font-size:14px}
  .pod.first .ini{background:var(--green);color:#fff}
  .pod .pos{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.04em}
  .pod.first .pos{color:var(--gdark)}
  .pod b{display:block;font-size:13.5px;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pod span{display:block;font-size:12px;color:var(--muted);margin-top:2px}
  .pod .pts{display:inline-block;margin-top:8px;font-size:12px;font-weight:600;padding:3px 9px;border-radius:100px;background:var(--band)}
  .pod.first .pts{background:var(--gsoft);color:var(--gdark)}
  /* chips */
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:100px;border:1px solid var(--line);font-size:12.5px;background:var(--surface)}
  .chip b{font-size:11.5px;color:var(--muted);font-weight:600}
  .chip.good{border-color:var(--gline);background:var(--gsoft);color:var(--gdark)}
  .chip.bad{border-color:var(--rline);background:var(--rsoft);color:var(--bad-ink)}
  .sub{font-size:12px;font-weight:600;color:var(--muted);margin:14px 0 8px}
  .sub:first-child{margin-top:0}
  /* tabla posiciones */
  .rank td:first-child{width:56px}
  .pos-n{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--band);font-weight:700;font-size:12.5px}
  .pos-n.top{background:var(--green);color:#fff}
  .emp{display:flex;align-items:center;gap:10px;min-width:0}
  .emp .ini{width:32px;height:32px;font-size:12px}
  .emp b{display:block;font-weight:600}
  .emp span{display:block;font-size:12px;color:var(--muted)}
  .mini{display:inline-flex;width:70px;height:6px;border-radius:100px;background:var(--band);overflow:hidden;vertical-align:middle;margin-right:8px}
  .mini i{background:var(--green)}
  .note{font-size:12px;color:var(--muted);margin-top:12px}
  /* reseñas */
  .rv-layout{display:grid;grid-template-columns:260px 1fr;gap:16px;align-items:start}
  .elist{display:flex;flex-direction:column;padding:6px}
  .elist button{display:flex;align-items:center;gap:10px;width:100%;padding:10px;border:none;background:none;border-radius:10px;text-align:left}
  .elist button:hover{background:var(--surface2)}
  .elist button.on{background:var(--band)}
  .elist .ini{width:34px;height:34px;font-size:12px}
  .elist .ini.all{background:var(--gsoft);color:var(--gdark)}
  .elist b{display:block;font-size:13.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .elist span{display:block;font-size:12px;color:var(--muted);margin-top:1px}
  .elist .r{margin-left:auto;font-size:13px;font-weight:600;white-space:nowrap}
  .elist .r small{color:var(--star)}
  .sumgrid{display:grid;grid-template-columns:auto 1fr 1fr;gap:22px;align-items:start}
  .big{font-size:40px;font-weight:650;letter-spacing:-.04em;line-height:1}
  .big+.stars{margin-top:6px}
  .stars{display:inline-flex;gap:1px;color:var(--star)}
  .stars svg{width:14px;height:14px;fill:currentColor;stroke:none}
  .stars svg.off{color:var(--star-off)}
  .rv{padding:16px 18px;border-bottom:1px solid var(--line)}
  .rv:last-child{border-bottom:none}
  .rv-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .rv-top .lbl{font-weight:600;font-size:13px}
  .rv-top time{margin-left:auto;font-size:12px;color:var(--muted)}
  .rv p{margin-top:8px;font-size:14px;line-height:1.5}
  .rv p.none{color:var(--muted);font-style:italic;font-size:13px}
  .rv .chips{margin-top:9px}
  .rv-by{font-size:12px;color:var(--muted);margin-top:9px}
  .rv-by b{color:var(--ink);font-weight:500}
  /* perfil */
  .form{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:18px}
  .form label{display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:500;color:var(--muted)}
  .form label.full{grid-column:1/-1}
  .form input,.form select,.form textarea{height:40px;border:1px solid var(--line2);border-radius:10px;padding:0 12px;background:var(--surface);color:var(--ink);font-size:14px}
  .form textarea{height:84px;padding:10px 12px;resize:vertical}
  .form input:focus,.form select:focus,.form textarea:focus{outline:none;border-color:var(--green)}
  .form .hint{font-weight:400;font-size:11.5px}
  .logo-up{display:flex;align-items:center;gap:14px;padding:18px;border-bottom:1px solid var(--line)}
  .logo-up .ini{width:64px;height:64px;font-size:22px;border-radius:16px}
  .file-field{display:flex!important;flex-direction:column;gap:7px!important;color:var(--muted);font-size:12.5px;font-weight:500}
  .file-box{display:flex;align-items:center;gap:10px;min-height:46px;padding:5px 6px 5px 12px;border:1px dashed var(--line2);border-radius:12px;background:var(--surface2);transition:border-color .15s,background .15s}
  .file-box:hover,.file-box:focus-within{border-color:var(--green);background:var(--gsoft)}
  .file-box input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
  .file-name{min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:12.5px;font-weight:400}
  .file-pick{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 11px;border:1px solid var(--line2);border-radius:9px;background:var(--surface);color:var(--ink);font-size:12.5px;font-weight:600;cursor:pointer;white-space:nowrap}
  .file-pick:hover{border-color:var(--green);color:var(--gdark)}
  .file-help{font-size:11.5px;font-weight:400;color:var(--muted)}
  .savebar{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
  @media(max-width:1000px){.grid3{grid-template-columns:1fr}.rv-layout{grid-template-columns:1fr}.sumgrid{grid-template-columns:1fr 1fr}.sumgrid>div:first-child{grid-column:1/-1}}
  @media(max-width:860px){
    .elist{flex-direction:row;overflow-x:auto;gap:6px;padding:8px;scrollbar-width:none}
    .elist::-webkit-scrollbar{display:none}
    .elist button{flex:0 0 auto;width:auto;border:1px solid var(--line);padding:7px 12px 7px 7px}
    .elist button.on{border-color:var(--ink);background:var(--surface)}
    .elist .r{display:none}
    .elist span{display:none}
    .form{grid-template-columns:1fr}
    .podium{gap:6px}
    .pod{padding:12px 6px 10px}
    .rank .hide-m{display:none}
    .rank td,.rank th{padding:11px 10px}
    .chart{gap:6px}
    .chart .col:nth-child(even) span{visibility:hidden}
    .pod .ini{width:36px;height:36px;font-size:12px}
    .pod b{font-size:12.5px}
    .pod span{font-size:11px}
  }
  .row .who b{white-space:normal}
  .row .who b .tag{display:inline-flex;margin-left:6px;vertical-align:1px}
  .form .full{grid-column:1/-1}
  .kpis.k7{grid-template-columns:repeat(7,1fr)}
  .kpis.k7 .kpi b{font-size:24px}
  @media(max-width:1100px){.kpis.k7{grid-template-columns:repeat(4,1fr)}}
  @media(max-width:860px){.kpis.k7{grid-template-columns:repeat(2,1fr)}.hide-m{display:none}td,th{padding:11px 12px}}

  /* ---- añadidos para embeber ---- */
  .ini{overflow:hidden}
  .ini img{width:100%;height:100%;object-fit:cover;display:block}
  button:disabled{opacity:.55;cursor:default}
  tr[data-b]:focus-visible,tr[data-emp]:focus-visible{outline:2px solid var(--green);outline-offset:-2px}
  .nohead .top{display:none}
  .nohead .side{top:0;height:100vh}
  .nohead .shell{min-height:100vh}
  @media(max-width:860px){.nohead .side{top:auto;height:auto}}

  /* ===== tema oscuro (misma paleta verde de Toque) ===== */
  .app.dark{color-scheme:dark;
    --ink:#f2f2f4;--muted:#a0a0a9;--line:#2a2a30;--line2:#3b3b43;--band:#212126;--bg:#0f0f11;
    --surface:#17171a;--surface2:#1d1d21;--glass:rgba(15,15,17,.78);
    --gdark:#4ade80;--gsoft:rgba(34,197,94,.14);--gline:rgba(34,197,94,.38);
    --amber:#fbbf24;--asoft:rgba(251,191,36,.13);
    --red:#f87171;--rsoft:rgba(248,113,113,.14);--rline:rgba(248,113,113,.38);--bad:#f87171;--bad-ink:#fca5a5;
    --neutral:#3b3b43;--faint:#5c5c66;--star-off:#34343b;--star:#f0c24d;
    --glow1:rgba(34,197,94,.16);--glow2:rgba(34,197,94,.08)}
  .app{background:radial-gradient(900px 440px at 6% -8%,var(--glow1),transparent 62%),radial-gradient(720px 380px at 100% 0%,var(--glow2),transparent 58%),var(--bg);
    transition:background-color .35s ease,color .35s ease}
  .toast{color:var(--bg)}
  .scrim{backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
  .app.dark .scrim{background:rgba(0,0,0,.55)}

  /* vidrio: tarjetas translúcidas con desenfoque */
  .card,.kpi,.pod{background-color:color-mix(in srgb,var(--surface) 84%,transparent);-webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%)}
  .card,.kpi,.pod,.btn,.icon-btn,.pill,.me,.search,.seg,.chip,.modal,.top,.side,.row,.tag,input,select,textarea,.nav button{transition:background-color .35s ease,border-color .35s ease,color .35s ease,box-shadow .25s ease,transform .25s cubic-bezier(.2,.7,.3,1)}
  .row:hover,tbody tr:hover td{background-color:var(--surface2)}
  .nav button.on{box-shadow:inset 3px 0 0 var(--green)}
  @media(max-width:860px){.nav button.on{box-shadow:none}}
  .nav button svg{transition:transform .25s cubic-bezier(.3,1.4,.5,1)}
  .nav button:hover svg{transform:scale(1.12)}
  .btn:active,.icon-btn:active,.seg button:active,.nav button:active{transform:scale(.97)}
  .btn.go:hover{box-shadow:0 10px 24px -12px rgba(34,197,94,.8)}
  .logo svg path{animation:wave 2.6s ease-in-out infinite}
  @keyframes wave{0%,100%{opacity:.45}50%{opacity:1}}

  /* elevación al pasar el mouse (solo donde hay hover real) */
  @media (hover:hover){
    .kpi:hover,.pod:hover,.grid2>.card:hover,.grid3>.card:hover{transform:translateY(-5px);box-shadow:0 20px 42px -24px rgba(0,0,0,.35);border-color:var(--gline)}
  }

  /* entrada escalonada (solo al cambiar de vista, no en cada guardado) */
  @keyframes rise{from{opacity:.4;transform:translateY(14px)}}
  @keyframes pop{from{opacity:.4;transform:scale(.93) translateY(8px)}}
  @keyframes grow{from{transform:scaleY(0)}}
  @keyframes growx{from{transform:scaleX(0)}}
  #view[data-enter]>*{animation:rise .55s cubic-bezier(.2,.7,.3,1) backwards}
  #view[data-enter]>*:nth-child(2){animation-delay:.06s}#view[data-enter]>*:nth-child(3){animation-delay:.12s}
  #view[data-enter]>*:nth-child(4){animation-delay:.18s}#view[data-enter]>*:nth-child(5){animation-delay:.24s}
  #view[data-enter]>*:nth-child(n+6){animation-delay:.3s}
  #view[data-enter] .kpis>*{animation:pop .55s cubic-bezier(.2,.7,.3,1) backwards}
  #view[data-enter] .kpis>*:nth-child(2){animation-delay:.07s}#view[data-enter] .kpis>*:nth-child(3){animation-delay:.14s}
  #view[data-enter] .kpis>*:nth-child(4){animation-delay:.21s}#view[data-enter] .kpis>*:nth-child(5){animation-delay:.28s}
  #view[data-enter] .kpis>*:nth-child(6){animation-delay:.35s}#view[data-enter] .kpis>*:nth-child(7){animation-delay:.42s}
  #view[data-enter] .pod{animation:pop .6s cubic-bezier(.2,.7,.3,1) backwards}
  #view[data-enter] .pod:nth-child(2){animation-delay:.1s}#view[data-enter] .pod:nth-child(3){animation-delay:.2s}
  #view[data-enter] .chart .bar{transform-origin:bottom;animation:grow .8s cubic-bezier(.2,.7,.3,1) .25s backwards}
  #view[data-enter] .chart .col:nth-child(2) .bar{animation-delay:.3s}#view[data-enter] .chart .col:nth-child(3) .bar{animation-delay:.35s}
  #view[data-enter] .chart .col:nth-child(4) .bar{animation-delay:.4s}#view[data-enter] .chart .col:nth-child(5) .bar{animation-delay:.45s}
  #view[data-enter] .chart .col:nth-child(6) .bar{animation-delay:.5s}#view[data-enter] .chart .col:nth-child(7) .bar{animation-delay:.55s}
  #view[data-enter] .chart .col:nth-child(8) .bar{animation-delay:.6s}
  #view[data-enter] .dist .tr i,#view[data-enter] .ratio i,#view[data-enter] .mini i{transform-origin:left;animation:growx .9s cubic-bezier(.2,.7,.3,1) .3s backwards}
  #view[data-enter] .row,#view[data-enter] .rv{animation:rise .45s cubic-bezier(.2,.7,.3,1) backwards}
  #view[data-enter] .row:nth-child(2),#view[data-enter] .rv:nth-child(2){animation-delay:.05s}
  #view[data-enter] .row:nth-child(3),#view[data-enter] .rv:nth-child(3){animation-delay:.1s}
  #view[data-enter] .row:nth-child(4),#view[data-enter] .rv:nth-child(4){animation-delay:.15s}
  #view[data-enter] .row:nth-child(n+5),#view[data-enter] .rv:nth-child(n+5){animation-delay:.2s}
  .modal{animation:pop .25s cubic-bezier(.2,.8,.3,1)}

  /* interruptor claro / oscuro */
  .theme-btn{display:inline-flex;align-items:center;gap:9px;height:34px;padding:0 12px 0 4px;border-radius:100px;border:1px solid var(--line2);background:var(--surface);font-weight:500;font-size:13px;color:var(--ink);white-space:nowrap}
  .theme-btn:hover{background:var(--band)}
  .theme-btn .tt{position:relative;display:block;width:46px;height:26px;border-radius:100px;background:var(--band);box-shadow:inset 0 0 0 1px var(--line2);flex-shrink:0;transition:background-color .3s}
  .theme-btn .thumb{position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:#fff;color:#f59e0b;box-shadow:0 1px 3px rgba(0,0,0,.28);transition:transform .38s cubic-bezier(.3,1.35,.5,1),background-color .3s,color .3s}
  .app.dark .theme-btn .thumb{transform:translateX(20px);background:var(--green);color:#fff}
  .theme-btn .thumb svg{position:absolute;inset:0;margin:auto;width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:opacity .25s,transform .45s cubic-bezier(.3,1.35,.5,1)}
  .theme-btn .moon{opacity:0;transform:rotate(-50deg) scale(.5)}
  .app.dark .theme-btn .moon{opacity:1;transform:none}
  .app.dark .theme-btn .sun{opacity:0;transform:rotate(70deg) scale(.5)}
  .themefab{display:none}
  .nohead .themefab{display:block;position:fixed;right:16px;bottom:16px;z-index:25}
  .themefab .theme-btn{padding:0 5px 0 4px;box-shadow:0 10px 28px -12px rgba(0,0,0,.45)}
  @media(max-width:860px){.theme-btn .lbl{display:none}.theme-btn{padding:0 4px}.nohead .themefab{bottom:78px}}

  
  /* ================= V11 · réplica "Dashboard V10" con verde Toque ================= */
  .app{--facets:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 1000%22 preserveAspectRatio=%22xMidYMid slice%22%3E%3Cpath d=%22M0 0L175 0L135 192Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 0L135 192L0 200Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M175 0L351 0L339 150Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M175 0L339 150L135 192Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M351 0L621 0L589 239Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M351 0L589 239L339 150Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M621 0L740 0L589 239Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M740 0L747 166L589 239Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M740 0L1005 0L747 166Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1017 253L747 166Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1181 0L1210 187Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1210 187L1017 253Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1181 0L1338 0L1466 145Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1181 0L1466 145L1210 187Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1338 0L1600 0L1600 243Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1338 0L1600 243L1466 145Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 200L135 192L0 374Z%22 fill=%22hsl(220,8%25,89%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L150 354L0 374Z%22 fill=%22hsl(220,8%25,89%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L339 150L373 437Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L373 437L150 354Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M339 150L589 239L373 437Z%22 fill=%22hsl(220,8%25,97%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M589 239L555 409L373 437Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M589 239L747 166L555 409Z%22 fill=%22hsl(220,8%25,97%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L819 384L555 409Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L1017 253L1006 347Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L1006 347L819 384Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1017 253L1210 187L1138 364Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1017 253L1138 364L1006 347Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1210 187L1466 145L1425 391Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1210 187L1425 391L1138 364Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1466 145L1600 243L1600 377Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1466 145L1600 377L1425 391Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 374L150 354L193 575Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 374L193 575L0 610Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M150 354L373 437L441 623Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M150 354L441 623L193 575Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M373 437L555 409L564 608Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M373 437L564 608L441 623Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M555 409L819 384L803 645Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M555 409L803 645L564 608Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M819 384L1006 347L803 645Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1032 574L803 645Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1138 364L1267 554Z%22 fill=%22hsl(220,8%25,97%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1267 554L1032 574Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1138 364L1425 391L1267 554Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1425 391L1388 630L1267 554Z%22 fill=%22hsl(220,8%25,97%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1425 391L1600 377L1388 630Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1600 377L1600 558L1388 630Z%22 fill=%22hsl(220,8%25,89%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 610L193 575L0 798Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M193 575L135 820L0 798Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M193 575L441 623L135 820Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M441 623L437 808L135 820Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M441 623L564 608L437 808Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M564 608L652 777L437 808Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M564 608L803 645L652 777Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L827 811L652 777Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L1032 574L1011 794Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L1011 794L827 811Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1032 574L1267 554L1247 853Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1032 574L1247 853L1011 794Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1267 554L1388 630L1247 853Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1396 819L1247 853Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1600 558L1600 747Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1600 747L1396 819Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 798L135 820L228 1000Z%22 fill=%22hsl(220,8%25,80%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 798L228 1000L0 1000Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 820L437 808L420 1000Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 820L420 1000L228 1000Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M437 808L652 777L420 1000Z%22 fill=%22hsl(220,8%25,87%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L669 1000L420 1000Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L827 811L845 1000Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L845 1000L669 1000Z%22 fill=%22hsl(220,8%25,83%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M827 811L1011 794L845 1000Z%22 fill=%22hsl(220,8%25,93%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1011 794L969 1000L845 1000Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1011 794L1247 853L969 1000Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1184 1000L969 1000Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1396 819L1423 1000Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1423 1000L1184 1000Z%22 fill=%22hsl(220,8%25,85%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1396 819L1600 747L1423 1000Z%22 fill=%22hsl(220,8%25,95%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1600 747L1600 1000L1423 1000Z%22 fill=%22hsl(220,8%25,91%25)%22 stroke=%22rgba(255,255,255,.7)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 0L135 192%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1181 0L1466 145%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M135 192L0 374%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M747 166L1006 347%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1017 253L1138 364%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1210 187L1425 391%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M0 374L193 575%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1006 347L1267 554%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1388 630L1247 853%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1600 747L1423 1000%22 stroke=%22rgba(255,255,255,.95)%22 stroke-width=%221.6%22/%3E%3C/svg%3E");--vig:rgba(232,233,237,.55);
    --bg:#e8e9ec;--ink:#1d1d1f;--muted:#5b5b66;--th:#62626d;
    --panel:rgba(255,255,255,.62);--panel-line:rgba(255,255,255,.95);--edge:rgba(20,20,35,.07);
    --hi:inset 0 1px 0 rgba(255,255,255,.9);--sh:0 1px 2px rgba(20,20,40,.05),0 16px 36px -22px rgba(20,20,40,.38);
    --strip:rgba(255,255,255,.5);--strip-line:rgba(20,20,35,.08);--strip-hover:rgba(255,255,255,.92);--field:rgba(255,255,255,.72);
    --modal:rgba(255,255,255,.94);--on-bg:#15803d;--on-ink:#fff;--chart:#2563eb;--chart-a:rgba(37,99,235,.22);--tip:#18181b;--tip-ink:#fff;
    --c-blue:#2563eb;--c-violet:#7c3aed;--c-green:#15803d;--c-amber:#b45309;--c-rose:#be123c;--c-cyan:#0e7490;
    --s-blue:rgba(37,99,235,.10);--s-violet:rgba(124,58,237,.10);--s-green:rgba(21,128,61,.10);--s-amber:rgba(180,83,9,.10);--s-rose:rgba(190,18,60,.09);--s-cyan:rgba(14,116,144,.10);
    --av-blue:#2563eb;--av-violet:#7c3aed;--av-green:#15803d;--av-amber:#b45309;--av-rose:#be123c;--av-cyan:#0e7490}
  .app.dark{--facets:url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 1000%22 preserveAspectRatio=%22xMidYMid slice%22%3E%3Cpath d=%22M0 0L175 0L135 192Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 0L135 192L0 200Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M175 0L351 0L339 150Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M175 0L339 150L135 192Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M351 0L621 0L589 239Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M351 0L589 239L339 150Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M621 0L740 0L589 239Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M740 0L747 166L589 239Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M740 0L1005 0L747 166Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1017 253L747 166Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1181 0L1210 187Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1005 0L1210 187L1017 253Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1181 0L1338 0L1466 145Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1181 0L1466 145L1210 187Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1338 0L1600 0L1600 243Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1338 0L1600 243L1466 145Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 200L135 192L0 374Z%22 fill=%22hsl(240,5%25,14%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L150 354L0 374Z%22 fill=%22hsl(240,5%25,14%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L339 150L373 437Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 192L373 437L150 354Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M339 150L589 239L373 437Z%22 fill=%22hsl(240,5%25,24%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M589 239L555 409L373 437Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M589 239L747 166L555 409Z%22 fill=%22hsl(240,5%25,24%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L819 384L555 409Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L1017 253L1006 347Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M747 166L1006 347L819 384Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1017 253L1210 187L1138 364Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1017 253L1138 364L1006 347Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1210 187L1466 145L1425 391Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1210 187L1425 391L1138 364Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1466 145L1600 243L1600 377Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1466 145L1600 377L1425 391Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 374L150 354L193 575Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 374L193 575L0 610Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M150 354L373 437L441 623Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M150 354L441 623L193 575Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M373 437L555 409L564 608Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M373 437L564 608L441 623Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M555 409L819 384L803 645Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M555 409L803 645L564 608Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M819 384L1006 347L803 645Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1032 574L803 645Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1138 364L1267 554Z%22 fill=%22hsl(240,5%25,24%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1006 347L1267 554L1032 574Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1138 364L1425 391L1267 554Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1425 391L1388 630L1267 554Z%22 fill=%22hsl(240,5%25,24%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1425 391L1600 377L1388 630Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1600 377L1600 558L1388 630Z%22 fill=%22hsl(240,5%25,14%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 610L193 575L0 798Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M193 575L135 820L0 798Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M193 575L441 623L135 820Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M441 623L437 808L135 820Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M441 623L564 608L437 808Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M564 608L652 777L437 808Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M564 608L803 645L652 777Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L827 811L652 777Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L1032 574L1011 794Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M803 645L1011 794L827 811Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1032 574L1267 554L1247 853Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1032 574L1247 853L1011 794Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1267 554L1388 630L1247 853Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1396 819L1247 853Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1600 558L1600 747Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1388 630L1600 747L1396 819Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 798L135 820L228 1000Z%22 fill=%22hsl(240,5%25,6%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 798L228 1000L0 1000Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 820L437 808L420 1000Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M135 820L420 1000L228 1000Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M437 808L652 777L420 1000Z%22 fill=%22hsl(240,5%25,12%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L669 1000L420 1000Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L827 811L845 1000Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M652 777L845 1000L669 1000Z%22 fill=%22hsl(240,5%25,8%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M827 811L1011 794L845 1000Z%22 fill=%22hsl(240,5%25,18%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1011 794L969 1000L845 1000Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1011 794L1247 853L969 1000Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1184 1000L969 1000Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1396 819L1423 1000Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1247 853L1423 1000L1184 1000Z%22 fill=%22hsl(240,5%25,10%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1396 819L1600 747L1423 1000Z%22 fill=%22hsl(240,5%25,21%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M1600 747L1600 1000L1423 1000Z%22 fill=%22hsl(240,5%25,16%25)%22 stroke=%22rgba(255,255,255,.07)%22 stroke-width=%221.2%22/%3E%3Cpath d=%22M0 0L135 192%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1181 0L1466 145%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M135 192L0 374%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M747 166L1006 347%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1017 253L1138 364%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1210 187L1425 391%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M0 374L193 575%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1006 347L1267 554%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1388 630L1247 853%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3Cpath d=%22M1600 747L1423 1000%22 stroke=%22rgba(255,255,255,.28)%22 stroke-width=%221.6%22/%3E%3C/svg%3E");--vig:rgba(5,5,7,.45);
    --bg:#0b0b0d;--muted:#a1a1aa;--th:#8d8d97;--surface:#17171b;--surface2:#1c1c21;--band:#1d1d22;--line:#26262c;--line2:#34343c;
    --panel:rgba(26,26,30,.6);--panel-line:rgba(255,255,255,.085);--edge:rgba(0,0,0,.35);
    --hi:inset 0 1px 0 rgba(255,255,255,.06);--sh:0 24px 48px -26px rgba(0,0,0,.85);
    --strip:rgba(255,255,255,.03);--strip-line:rgba(255,255,255,.07);--strip-hover:rgba(255,255,255,.07);--field:rgba(255,255,255,.05);
    --modal:rgba(24,24,28,.94);--on-bg:#22c55e;--on-ink:#052e16;--chart:#38bdf8;--chart-a:rgba(56,189,248,.26);--tip:#f4f4f5;--tip-ink:#111113;
    --c-blue:#60a5fa;--c-violet:#a78bfa;--c-green:#4ade80;--c-amber:#fbbf24;--c-rose:#fb7185;--c-cyan:#22d3ee;
    --s-blue:rgba(96,165,250,.13);--s-violet:rgba(167,139,250,.13);--s-green:rgba(74,222,128,.12);--s-amber:rgba(251,191,36,.12);--s-rose:rgba(251,113,133,.12);--s-cyan:rgba(34,211,238,.12);
    --neutral:#3a3a42}

  /* fondo: facetas + viñeta (lo que el vidrio desenfoca) */
  .app{position:relative;isolation:isolate;min-height:100vh;background:var(--bg);
    display:grid;grid-template-columns:252px minmax(0,1fr);gap:16px;padding:16px;align-items:start}
  .app::before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;
    background:radial-gradient(ellipse 80% 70% at 55% 40%,transparent 35%,var(--vig) 100%),var(--facets) center/cover no-repeat}
  #layer{display:contents}

  /* vidrio */
  .card,.kpi,.pod,.side,.top{background-color:var(--panel);background-image:none;border:1px solid var(--panel-line);
    box-shadow:var(--hi),0 0 0 1px var(--edge),var(--sh);-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%)}
  .card{border-radius:16px}.kpi{border-radius:16px}.pod{border-radius:14px}

  /* barra lateral */
  .side{position:sticky;top:16px;height:calc(100vh - 32px);margin:0;padding:14px 12px 12px;border-radius:18px;display:flex;flex-direction:column;overflow:hidden}
  .nohead .side{top:16px;height:calc(100vh - 32px)}
  .brand{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:4px 8px 16px;margin-bottom:4px;border-bottom:1px solid var(--strip-line);text-decoration:none;color:var(--ink)}
  .brand .wm{display:flex;align-items:center;gap:8px}
  .brand .wm svg{width:30px;height:30px;filter:drop-shadow(0 0 10px rgba(34,197,94,.45))}
  .brand .wm b{font-size:26px;font-weight:700;letter-spacing:-.045em;line-height:1}
  .brand .who{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px 0 8px;border-radius:100px;font-size:11.5px;font-weight:600;
    background:var(--s-green);color:var(--c-green);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-green) 32%,transparent)}
  .app:not(.dark) .brand .who{color:#166534}
  .brand .who svg{width:13px;height:13px}
  .side>small{display:none}
  .nav{flex:1;min-height:0;overflow-y:auto;scrollbar-width:none;gap:2px}
  .nav-sec{display:block;font-size:10.5px;font-weight:600;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);padding:16px 10px 6px}
  .nav button{height:38px;border-radius:10px;font-size:13.5px;gap:11px}
  .nav button svg{width:17px;height:17px}
  .nav button:hover{background:var(--strip)}
  .nav button.on{background:var(--strip-hover);color:var(--ink);font-weight:600;box-shadow:inset 0 0 0 1px var(--strip-line),0 6px 16px -10px rgba(0,0,0,.4)}
  .nav button.on svg{color:var(--green);filter:none}
  .nav .cnt{background:var(--field);border:1px solid var(--strip-line);color:var(--muted)}
  .nav .cnt.hot{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 0 12px -2px rgba(34,197,94,.7)}
  .nav .cnt.live{display:inline-flex;align-items:center;gap:5px;width:auto;background:var(--s-rose);border-color:color-mix(in srgb,var(--c-rose) 35%,transparent);color:var(--c-rose);font-size:10.5px;padding:0 7px}
  .side-foot{margin-top:8px;display:flex;align-items:center;gap:10px;padding:12px 6px 2px;border-top:1px solid var(--strip-line)}
  .side-foot .av{width:34px;height:34px;border-radius:10px;font-size:13px;background:linear-gradient(150deg,#34d26a,#15803d);box-shadow:0 6px 16px -8px rgba(34,197,94,.8)}
  .side-foot .sf-t{min-width:0}
  .side-foot b{display:block;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .side-foot span{display:block;font-size:11.5px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  /* columna principal y barra de herramientas */
  .col{min-width:0;display:flex;flex-direction:column;gap:16px}
  .top{position:sticky;top:16px;z-index:20;height:60px;margin:0;padding:0 10px 0 12px;border-radius:16px;gap:8px;border-bottom:1px solid var(--panel-line)}
  .m-logo{display:none;align-items:center;gap:7px;font-weight:700;font-size:17px;letter-spacing:-.03em;color:var(--ink);text-decoration:none}
  .m-logo svg{width:22px;height:22px}
  .tsearch{display:flex;align-items:center;gap:8px;height:38px;width:min(320px,30%);padding:0 12px;border-radius:10px;background:var(--field);border:1px solid var(--strip-line);color:var(--muted)}
  .tsearch svg{width:15px;height:15px;flex-shrink:0}
  .tsearch input{border:none;outline:none;background:none;flex:1;min-width:0;color:var(--ink);font-size:13px}
  .tsearch input::placeholder{color:var(--muted)}
  .tsearch:focus-within{border-color:var(--green);box-shadow:0 0 0 3px rgba(34,197,94,.16)}
  #topPer{display:flex}
  #topPer .seg{padding:3px}
  #topPer .seg button{height:30px;font-size:12.5px;padding:0 12px}
  .top .pill{height:34px;white-space:nowrap}
  @media(max-width:1500px){.top .theme-btn .lbl{display:none}.top .theme-btn{padding:0 4px}}
  @media(max-width:1250px){.top .pill{display:none}}
  .me{display:none}
  .bellw{position:relative}
  .bell{position:relative}
  .bell .dot{position:absolute;top:6px;right:7px;width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 2px var(--panel),0 0 10px rgba(34,197,94,.9)}
  .npanel{position:absolute;right:0;top:calc(100% + 10px);width:min(360px,86vw);max-height:420px;overflow:auto;z-index:40;border-radius:16px;padding:8px;
    background:var(--modal);border:1px solid var(--panel-line);box-shadow:0 0 0 1px var(--edge),0 30px 60px -24px rgba(0,0,0,.6);-webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px)}
  .npanel h3{font-size:12px;font-weight:600;color:var(--muted);padding:6px 8px 8px}
  .npanel button{display:flex;gap:10px;width:100%;padding:9px 8px;border:none;background:none;border-radius:10px;text-align:left;align-items:flex-start;color:var(--ink)}
  .npanel button:hover{background:var(--strip-hover)}
  .npanel b{display:block;font-size:13px;font-weight:600;line-height:1.35}
  .npanel span{display:block;font-size:12px;color:var(--muted);margin-top:2px}
  .npanel .none{padding:18px 8px;color:var(--muted);font-size:13px;text-align:center}
  .cta{height:36px;padding:0 14px}
  .main{padding:0 0 24px}
  .wrap{max-width:1360px}

  /* encabezado de página */
  .head{margin:4px 2px 16px;align-items:center}
  .head h1{font-size:26px;letter-spacing:-.03em}
  .head p{font-size:13px;color:var(--muted)}

  /* tarjetas */
  .card-h{display:flex;align-items:flex-start;gap:10px;padding:16px 18px 10px;border-bottom:none}
  .card-h>svg{margin-top:1px;color:var(--muted)}
  .card-h h2{font-size:14.5px;font-weight:600}
  .card-h p{font-size:12px;color:var(--muted);margin-top:3px}
  .card-h .seg,.card-h .lk,.card-h .live,.card-h .btn{margin-left:auto}
  .card-h .seg{padding:3px}.card-h .seg button{height:28px;font-size:12px;padding:0 11px}
  .card-h .lk{color:var(--green);font-weight:500;white-space:nowrap}
  .app:not(.dark) .card-h .lk{color:var(--gdark)}
  .live{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:100px;font-size:11px;font-weight:600;
    background:var(--s-green);color:var(--c-green);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-green) 30%,transparent);white-space:nowrap}
  .live::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 1.6s ease-in-out infinite}
  @keyframes blink{50%{opacity:.25}}
  .pad{padding:8px 18px 18px}
  .g21{display:grid;grid-template-columns:minmax(0,1.85fr) minmax(0,1fr);gap:16px;margin-bottom:16px}
  .g11{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-bottom:16px}
  .g21>.card,.g11>.card{min-width:0}
  @media(max-width:1100px){.g21,.g11{grid-template-columns:minmax(0,1fr)}}

  /* KPI estilo V10 */
  .kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:16px}
  .kpi{position:relative;padding:16px 18px;text-align:left;color:var(--ink)}
  .kpi .kh{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
  .kpi .kh span{font-size:12.5px;font-weight:500;color:var(--muted);padding:0;min-height:0}
  .kpi b{font-size:27px;margin-top:8px;letter-spacing:-.03em}
  .kpi small{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-top:10px;font-size:11.5px;color:var(--muted)}
  .kpi small em{font-style:normal;display:inline-flex;align-items:center;height:20px;padding:0 7px;border-radius:100px;font-weight:600;font-size:11px;font-variant-numeric:tabular-nums}
  .kpi small.up em{background:var(--s-green);color:var(--c-green);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-green) 32%,transparent)}
  .kpi small.down em{background:var(--s-rose);color:var(--c-rose);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-rose) 32%,transparent)}
  .kpi small.up,.kpi small.down{color:var(--muted)}
  .app:not(.dark) .kpi small.up em{color:#166534}.app:not(.dark) .kpi small.down em{color:#9f1239}
  button.kpi{cursor:pointer;font:inherit}
  .kc,.fi .ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex-shrink:0;font-style:normal;
    background:var(--s-tone,var(--s-green));color:var(--tone,var(--c-green));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--tone,var(--c-green)) 30%,transparent)}
  .kc svg,.fi .ic svg{width:15px;height:15px}
  .blue{--tone:var(--c-blue);--s-tone:var(--s-blue)}.violet{--tone:var(--c-violet);--s-tone:var(--s-violet)}.green{--tone:var(--c-green);--s-tone:var(--s-green)}
  .amber{--tone:var(--c-amber);--s-tone:var(--s-amber)}.rose{--tone:var(--c-rose);--s-tone:var(--s-rose)}.cyan{--tone:var(--c-cyan);--s-tone:var(--s-cyan)}

  /* avatares de color (iniciales) */
  .ini{background:var(--strip-hover);color:var(--ink);border-radius:9px}
  .ini[data-tone]{color:#fff;background:var(--av,var(--av-green))}
  .ini[data-tone=blue]{--av:var(--av-blue)}.ini[data-tone=violet]{--av:var(--av-violet)}.ini[data-tone=green]{--av:var(--av-green)}
  .ini[data-tone=amber]{--av:var(--av-amber)}.ini[data-tone=rose]{--av:var(--av-rose)}.ini[data-tone=cyan]{--av:var(--av-cyan)}
  .ini.biz{border-radius:9px;background:var(--s-green);color:var(--c-green);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-green) 28%,transparent)}
  .app:not(.dark) .ini.biz{color:var(--gdark)}

  /* tablas estilo V10 */
  .tbl{overflow-x:auto}
  table{font-size:13px;color:var(--ink);font-family:inherit}
  th,td{white-space:nowrap}td.wrap{white-space:normal}
  th{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--th);background:transparent;padding:10px 18px;border-bottom:1px solid var(--strip-line)}
  td{padding:11px 18px;border-bottom:1px solid var(--strip-line)}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover td{background-color:var(--strip)}
  td .emp b{font-size:13px}td .emp span{font-size:11.5px}
  td .acts{display:flex;gap:6px;justify-content:flex-end;align-items:center}
  .tq{color:var(--c-blue)}
  .mut{color:var(--muted)}
  td.cm{max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

  /* píldoras de estado */
  .tag{height:22px;border-radius:100px;font-size:11px}
  .tag.g{background:var(--s-green);color:var(--c-green);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-green) 32%,transparent)}
  .tag.a{background:var(--s-amber);color:var(--c-amber);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-amber) 32%,transparent)}
  .tag.r,.tag.off{background:var(--s-rose);color:var(--c-rose);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-rose) 32%,transparent)}
  .tag.b{background:var(--s-blue);color:var(--c-blue);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c-blue) 32%,transparent)}
  .tag:not(.g):not(.a):not(.r):not(.off):not(.b){background:var(--field);color:var(--muted);box-shadow:inset 0 0 0 1px var(--strip-line)}
  .app:not(.dark) .tag.g{color:#166534}.app:not(.dark) .tag.a{color:#92400e}.app:not(.dark) .tag.r,.app:not(.dark) .tag.off{color:#9f1239}

  /* filas y listas */
  .card>.row,.group-b>.row,.pay-cards>.row{margin:0 10px 8px;border:1px solid var(--strip-line);border-radius:12px;background:var(--strip)}
  .card>.row:first-child,.card>.card-h+.row{margin-top:2px}
  .card>.row:last-child{margin-bottom:10px}
  .row:hover{background-color:var(--strip-hover)}
  .group-h,.biz-card{background:transparent}.biz-card:hover{background:var(--strip)}
  .group-b{border-top:1px solid var(--strip-line);padding-top:8px}
  .rv{border-bottom:1px solid var(--strip-line)}
  .rv:last-child{border-bottom:none}

  /* controles */
  .seg{background:var(--field);border:1px solid var(--strip-line);border-radius:10px;padding:3px}
  .seg button{border-radius:8px;color:var(--muted)}
  .seg button:not(.on):hover{color:var(--ink);background:var(--strip-hover)}
  .seg button.on{background:var(--on-bg);color:var(--on-ink);font-weight:600;box-shadow:0 6px 16px -8px rgba(34,197,94,.7)}
  .btn,.icon-btn,.pill,.chip,.search,.theme-btn{background-color:var(--field);border-color:var(--strip-line);color:var(--ink)}
  .btn:hover,.icon-btn:hover,.theme-btn:hover{background-color:var(--strip-hover)}
  .btn.go{background:var(--green);border-color:var(--green);color:#fff;box-shadow:0 8px 20px -10px rgba(34,197,94,.8)}
  .btn.go:hover{background:#16a34a;border-color:#16a34a}
  .btn.ghost{background:none;border-color:transparent}
  .btn.ghost:hover{background:var(--strip-hover)}
  .btn.del{color:var(--c-rose)}
  .chip{border-color:var(--strip-line)}
  .chip.good{background:var(--s-green);border-color:color-mix(in srgb,var(--c-green) 30%,transparent);color:var(--c-green)}
  .chip.bad{background:var(--s-rose);border-color:color-mix(in srgb,var(--c-rose) 30%,transparent);color:var(--c-rose)}
  .app:not(.dark) .chip.good{color:#166534}.app:not(.dark) .chip.bad{color:#9f1239}
  .form input,.form select,.form textarea,.modal input,.modal select{background:var(--field);border-color:var(--strip-line);color:var(--ink)}
  .form input:focus,.form select:focus,.form textarea:focus,.modal input:focus,.modal select:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(34,197,94,.18)}
  .logo-up{border-bottom:1px solid var(--strip-line)}
  .modal{background:var(--modal);border:1px solid var(--panel-line);border-radius:18px;box-shadow:0 0 0 1px var(--edge),0 40px 80px -30px rgba(0,0,0,.6)}
  .modal header{border-bottom-color:var(--strip-line)}
  .toast{background:var(--tip);color:var(--tip-ink)}

  /* gráfico de área (se dibuja con el ancho real) */
  .achart{position:relative;height:230px}
  .achart svg{display:block;width:100%;height:100%;overflow:visible}
  .achart .ax{font-size:10.5px;fill:var(--muted);font-family:var(--font)}
  .achart .gl{stroke:var(--strip-line)}
  .achart .ln{fill:none;stroke:var(--chart);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
  .app.dark .achart .ln{filter:drop-shadow(0 0 6px rgba(56,189,248,.55))}
  .achart .pt{fill:var(--panel-solid,#fff);stroke:var(--chart);stroke-width:2}
  .app.dark .achart .pt{fill:#0f1013}
  .achart .pt.last{fill:var(--chart)}
  .achart .xh{stroke:var(--muted);stroke-dasharray:3 3;opacity:.7}
  .ctip{position:absolute;pointer-events:none;transform:translate(-50%,-100%);margin-top:-12px;padding:6px 9px;border-radius:8px;background:var(--tip);color:var(--tip-ink);
    font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 10px 24px -10px rgba(0,0,0,.5)}
  .ctip span{display:block;font-size:11px;font-weight:500;opacity:.75}

  /* dona */
  .donut{display:flex;flex-direction:column;align-items:center;gap:16px}
  .dwrap{position:relative;width:150px;height:150px}
  .dwrap svg{width:100%;height:100%;transform:rotate(-90deg)}
  .dwrap .bgc{fill:none;stroke:var(--strip-line);stroke-width:13}
  .dwrap .sgc{fill:none;stroke-width:13}
  .app.dark .dwrap .sgc{filter:drop-shadow(0 0 4px rgba(255,255,255,.12))}
  .dc{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
  .dc b{font-size:26px;font-weight:700;letter-spacing:-.03em}
  .dc span{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;font-weight:600}
  .dleg{width:100%;display:flex;flex-direction:column;gap:9px}
  .dleg div{display:flex;align-items:center;gap:8px;font-size:12.5px}
  .dleg i{width:8px;height:8px;border-radius:50%;flex-shrink:0;background:var(--tone)}
  .dleg span{color:var(--ink)}
  .dleg b{margin-left:auto;font-weight:600;font-variant-numeric:tabular-nums}
  .dleg b small{font-weight:500;color:var(--muted);margin-left:4px}
  #view[data-enter] .dwrap .sgc{animation:ring 1s cubic-bezier(.2,.7,.3,1) .2s backwards}
  @keyframes ring{from{stroke-dasharray:0 400}}

  /* feed en vivo */
  .feed{list-style:none;padding:2px 10px 10px;display:flex;flex-direction:column;gap:6px}
  .fi{display:flex;gap:10px;align-items:flex-start;padding:9px 8px;border-radius:12px;border:1px solid transparent}
  .fi:hover{background:var(--strip);border-color:var(--strip-line)}
  .fi div{min-width:0;flex:1}
  .fi b{display:block;font-size:12.5px;font-weight:600;line-height:1.35}
  .fi span{display:block;font-size:11.5px;color:var(--muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .fi time{font-size:11px;color:var(--muted);white-space:nowrap}

  /* lista de ranking compacta */
  .tops{padding:2px 10px 10px;display:flex;flex-direction:column;gap:6px}
  .topr{display:flex;align-items:center;gap:10px;padding:8px;border-radius:12px;border:1px solid var(--strip-line);background:var(--strip)}
  .topr .n{width:22px;font-weight:700;color:var(--muted);text-align:center;font-variant-numeric:tabular-nums}
  .topr.first .n{color:var(--c-amber)}
  .topr .ini{width:32px;height:32px;font-size:12px}
  .topr>div:not(.ini){min-width:0;flex:1}.topr b{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .topr span{display:block;font-size:11.5px;color:var(--muted)}
  .topr em{font-style:normal;font-weight:700;font-variant-numeric:tabular-nums}
  .topr.me{border-color:color-mix(in srgb,var(--c-green) 45%,transparent);background:var(--s-green)}

  /* barras simples (día de la semana, NFC) */
  .hbars{display:flex;flex-direction:column;gap:12px;padding:6px 18px 18px}
  .hb{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 12px;align-items:center}
  .hb span{font-size:12.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .hb b{font-size:12.5px;font-variant-numeric:tabular-nums}
  .hb i{grid-column:1/-1;display:block;height:6px;border-radius:100px;background:var(--strip-line);overflow:hidden}
  .hb i u{display:block;height:100%;border-radius:100px;background:var(--tone,var(--chart))}
  #view[data-enter] .hb i u{transform-origin:left;animation:growx .9s cubic-bezier(.2,.7,.3,1) .25s backwards}
  .chart{height:170px;padding:6px 18px 0}
  .chart .bar{border-radius:7px;background:var(--strip-line)}
  .chart .bar i{background:var(--chart)}

  /* héroe de posición (vista empleado) */
  .hero{position:relative;overflow:hidden;border-radius:18px;padding:22px 24px;margin-bottom:16px;color:#fff;
    background-color:#15803d;background-image:linear-gradient(135deg,#0d3b20 0%,#116a33 55%,#15803d 100%);box-shadow:0 24px 50px -24px rgba(34,197,94,.55),inset 0 1px 0 rgba(255,255,255,.25);
    display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:24px;align-items:center}
  .hero::after{content:"";position:absolute;inset:0;background:radial-gradient(500px 220px at 85% -10%,rgba(255,255,255,.08),transparent 60%);pointer-events:none}
  .hero .pos{font-size:64px;font-weight:800;letter-spacing:-.05em;line-height:1}
  .hero .pos small{font-size:20px;font-weight:700;opacity:.85;margin-left:2px}
  .hero h2{font-size:19px;font-weight:700;letter-spacing:-.02em;line-height:1.25;color:#fff}
  .hero p{font-size:13px;color:#dcfce7;margin-top:6px;line-height:1.45}
  .hero .prog{margin-top:12px;height:8px;border-radius:100px;background:rgba(0,0,0,.25);overflow:hidden}
  .hero .prog u{display:block;height:100%;border-radius:100px;background:#fff}
  .hero .left{text-align:center;padding:12px 16px;border-radius:14px;background:rgba(0,0,0,.2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
  .hero .left b{display:block;font-size:30px;font-weight:800;line-height:1}
  .hero .left span{display:block;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#dcfce7;margin-top:4px}
  @media(max-width:700px){.hero{grid-template-columns:auto minmax(0,1fr);gap:16px}.hero .left{grid-column:1/-1}}
  .tip-l{display:flex;flex-direction:column;gap:8px;padding:2px 10px 12px}
  .tipc{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:12px;border:1px solid var(--strip-line);background:var(--strip)}
  .tipc b{display:block;font-size:13.5px;font-weight:600;line-height:1.4}
  .tipc span{display:block;font-size:12.5px;color:var(--muted);margin-top:3px;line-height:1.45}
  .pos-n.lead{background:var(--green);color:#fff}
  .emp b .tag{display:inline-flex;margin-left:6px;height:18px;font-size:10.5px;vertical-align:1px}
  tr.me-row td{background:var(--s-green)}
  tr.me-row td:first-child{box-shadow:inset 3px 0 0 var(--green)}

  /* reseñas en carrusel horizontal */
  .rv-layout>*{min-width:0}
  .rvc .card-h{align-items:center}
  .carnav{margin-left:auto;display:flex;gap:6px}
  .carnav .icon-btn{width:34px;height:34px}
  .carnav .icon-btn svg{width:16px;height:16px}
  .carnav .icon-btn:disabled{opacity:.35}
  .rv-car{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(260px,calc((100% - 28px)/3));gap:14px;overflow-x:auto;overscroll-behavior-x:contain;
    scroll-snap-type:x mandatory;scroll-padding:0 18px;padding:4px 18px 18px;scrollbar-width:thin;scrollbar-color:var(--strip-line) transparent;cursor:grab;
    -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 18px,#000 calc(100% - 24px),transparent)}
  .rv-car:focus-visible{outline:2px solid var(--green);outline-offset:-2px;border-radius:12px}
  .rv-car.drag{scroll-snap-type:none;cursor:grabbing;user-select:none}
  .rv-car .rv{scroll-snap-align:start;display:flex;flex-direction:column;border:1px solid var(--strip-line);border-radius:14px;background:var(--strip);padding:16px;min-height:200px;
    transition:background-color .25s ease,border-color .25s ease,transform .25s cubic-bezier(.2,.7,.3,1)}
  .rv-car .rv:last-child{border-bottom:1px solid var(--strip-line)}
  @media (hover:hover){.rv-car .rv:hover{background:var(--strip-hover);border-color:color-mix(in srgb,var(--green) 35%,transparent);transform:translateY(-3px)}}
  .rv-car .rv-top{gap:8px}
  .rv-car .rv p{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .rv-car .rv-by{margin-top:auto;padding-top:12px}
  @media(max-width:1100px){.rv-car{grid-auto-columns:minmax(240px,calc((100% - 14px)/2))}}
  @media(max-width:600px){.rv-car{grid-auto-columns:86%;padding:4px 14px 16px;scroll-padding:0 14px}}
  @media (prefers-reduced-motion:no-preference){.rv-car{scroll-behavior:smooth}.rv-car.drag{scroll-behavior:auto}}

  /* vista de solo lectura (empleado) */
  .app.readonly{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}

  /* móvil */
  @media(max-width:860px){
    .app{grid-template-columns:minmax(0,1fr);gap:12px;padding:10px}
    .side{position:fixed;top:auto;left:10px;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));height:auto;padding:6px;z-index:30;border-radius:20px;overflow:visible}
    .nohead .side{top:auto;height:auto}
    .brand,.side-foot,.nav-sec{display:none}
    .nav{flex-direction:row;overflow-x:auto;justify-content:flex-start}
    .nav button{flex:1 0 64px;height:52px;flex-direction:column;gap:3px;font-size:10.5px;padding:0 4px}
    .top{top:10px;height:auto;min-height:56px;flex-wrap:wrap;padding:8px 10px;row-gap:8px}
    .m-logo{display:flex}
    .tsearch{display:none}
    #topPer{order:10;flex-basis:100%;overflow-x:auto}
    #topPer:empty{display:none}
    .top .pill,.cta .lbl{display:none}
    .cta{padding:0 10px}
    .main{padding:0 0 100px}
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .kpi b{font-size:23px}
    .hero .pos{font-size:48px}
  }
  @media(max-width:600px){.card-h{flex-wrap:wrap}.card-h .seg{margin-left:0;order:3;max-width:100%;overflow-x:auto}}

  @media (prefers-reduced-motion:reduce){.app,.app *,.app *::before,.app *::after{animation:none!important;transition:none!important}}
`;

const BASE = globalThis.location?.origin || '';
const DAY = 864e5;
const GOOD_CHIPS = ['Amable','Rápido','Buena recomendación','Atento','Simpático'];
const BAD_CHIPS = ['Tardó mucho','Poco atento','Se equivocó en el pedido','Poco amable'];
const LABELS = ['','Mala','Regular','Buena','Muy buena','¡Excelente!'];

/* ===== datos de ejemplo (solo se usan si el padre no pasa `data`) ===== */
export function demoAdminData(){
const NOW=new Date();
function rng(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
const R=rng(20260930);
const pick=a=>a[Math.floor(R()*a.length)];
const MSG_GOOD=['Nos atendió súper bien, muy pendiente de todo.','Excelente recomendación del postre, volveremos.','Muy amable y rápido, todo perfecto.','Nos explicó la carta con paciencia. ¡Gracias!','Atención de diez, muy cálido.','Llegó todo a tiempo y caliente.','Se acordó de nuestro pedido de la vez pasada.'];
const MSG_MID=['Bien, aunque tardó un poco en traer la cuenta.','Correcto, nada fuera de lo normal.','Buena atención pero había mucha espera.'];
const MSG_BAD=['Esperamos casi 30 minutos por los platos.','Trajo un plato que no pedimos.','No volvió a pasar por la mesa.','Poco amable al pedirle la cuenta.'];
const CLIENTS=['María F.','Andrés L.','Camila R.','Diego P.','Valeria S.','Invitado','Sofía M.','Mateo G.','Invitado','Lucía T.','Sebastián V.','Invitado'];

const DATA={
  owner:{id:'u4',name:'Ricardo Perez',email:'rickypcyt@gmail.com'},
  business:{id:'b1',name:'Cafe de Tere',category:'Cafetería',description:'Café de especialidad, desayunos y postres caseros.',address:'',city:'',phone:'',hours:'',website:'',instagram:'',googleReviewUrl:'',status:'verified'},
  employees:[
    {id:'e1',name:'Ricardo Perez Zunino',role:'Mesero',email:'ricardo.perez04@goumh.umh.es',active:true,q:.86},
    {id:'e2',name:'Pepito',role:'Mesero',email:'rmunoz@gmail.com',active:true,q:.62},
    {id:'e3',name:'Juan Carlos Sotomayor',role:'Cajero',email:'jsotomayorvera@gmail.com',active:true,q:.78},
  ],
  joinRequests:[{id:'j1',name:'Andrea Molina',email:'andrea.molina@example.com',jobTitle:'Mesera',when:'Hace 2 horas'}],
  reviews:[],
  taps:[], // {tag, date}
  tags:[{id:'t0',label:'Reseña en Google (Tipo A)',type:'business_google'},{id:'t1',label:'NFC de Ricardo Perez Zunino',type:'employee_review',emp:'e1'},{id:'t2',label:'NFC de Pepito',type:'employee_review',emp:'e2'},{id:'t3',label:'NFC de Juan Carlos Sotomayor',type:'employee_review',emp:'e3'}],
};
(function gen(){
  let id=0;
  DATA.employees.forEach((e,ei)=>{
    const n=[24,17,20][ei];
    for(let i=0;i<n;i++){
      const ago=Math.floor(R()*72)+(R()<.15?0:0);
      const x=R();
      let rating=x<e.q?(R()<.7?5:4):(x<e.q+.12?3:(R()<.6?2:1));
      const good=rating>=4;
      const chips=[...(good?GOOD_CHIPS:BAD_CHIPS)].sort(()=>R()-.5).slice(0,rating===3?1:Math.ceil(R()*2));
      const hasMsg=R()<.68;
      const msg=hasMsg?(rating>=4?pick(MSG_GOOD):rating===3?pick(MSG_MID):pick(MSG_BAD)):'';
      const date=new Date(NOW.getTime()-ago*DAY-Math.floor(R()*10)*36e5);
      DATA.reviews.push({id:'r'+(++id),emp:e.id,rating,chips,msg,client:pick(CLIENTS),date});
      DATA.taps.push({tag:'t'+(ei+1),date});
      if(R()<.55)DATA.taps.push({tag:'t'+(ei+1),date:new Date(date.getTime()-36e5)});
    }
  });
  for(let i=0;i<46;i++)DATA.taps.push({tag:'t0',date:new Date(NOW.getTime()-Math.floor(R()*72)*DAY)});
  DATA.reviews.sort((a,b)=>b.date-a.date);
})();
const DB={
  users:[
    {id:'u1',name:'Ricardo Perez Zunino',email:'ricardo.perez04@goumh.umh.es',role:'employee'},
    {id:'u2',name:'Pepito',email:'rmunoz@gmail.com',role:'employee'},
    {id:'u3',name:'Juan Carlos Sotomayor',email:'jsotomayorvera@gmail.com',role:'admin'},
    {id:'u4',name:'Ricardo Perez',email:'rickypcyt@gmail.com',role:'admin'},
    {id:'u5',name:'Andrea Molina',email:'andrea.molina@example.com',role:'user'},
    {id:'u6',name:'Daniela Ruiz',email:'daniela.ruiz@example.com',role:'user'},
  ],
  businesses:[{id:'b1',name:'Cafe de Tere',ownerId:'u4',status:'verified',featured:false,category:'Cafetería',city:'',address:'',phone:'',website:'',instagram:'',googleReviewUrl:'',hours:'',description:DATA.business.description}],
  employees:DATA.employees.map((e,i)=>({id:e.id,name:e.name,businessId:'b1',userId:['u1','u2','u3'][i],role:e.role,active:e.active})),
  tags:DATA.tags.map(t=>({...t,businessId:'b1',active:true})),
  requests:[
    {id:'q1',type:'business',name:'Heladería Polar',category:'Heladería',city:'Guayaquil',address:'',by:'Daniela Ruiz',email:'daniela.ruiz@example.com',supporters:3},
    {id:'q2',type:'employee',userId:'u5',name:'Andrea Molina',email:'andrea.molina@example.com',businessId:'b1',job:'Mesera'},
  ],
  payments:[
    {id:'p1',ref:'TQ-000124',product:'plan_starter',qty:3,amount:79.99,status:'approved',buyer:'Ricardo Perez',email:'rickypcyt@gmail.com',business:'Cafe de Tere',date:new Date(NOW-21*DAY)},
    {id:'p2',ref:'TQ-000125',product:'tag_a',qty:1,amount:40,status:'approved',buyer:'Ricardo Perez',email:'rickypcyt@gmail.com',business:'Cafe de Tere',date:new Date(NOW-20*DAY)},
    {id:'p3',ref:'TQ-000131',product:'tag_a',qty:1,amount:40,status:'expired',buyer:'Daniela Ruiz',email:'daniela.ruiz@example.com',business:'Heladería Polar',date:new Date(NOW-3*DAY)},
  ],
  categories:['Cafetería','Restaurante','Bar','Panadería','Heladería'],
};
DB.tags.forEach(t=>{t.url=BASE+'/nfc/demo-'+t.id;});
return {me:{name:'Juan Carlos Sotomayor'},reviews:DATA.reviews,taps:DATA.taps,db:DB};
}

/* Acepta fechas como string ISO o Date y completa campos opcionales. */
export function normalizeAdmin(d){
  const db = {users:[],businesses:[],employees:[],tags:[],requests:[],payments:[],categories:[],...d.db};
  db.users = db.users.map(u=>({role:'user',email:'',...u}));
  db.businesses = db.businesses.map(b=>({ownerId:'',status:'verified',featured:false,category:'',city:'',address:'',phone:'',website:'',instagram:'',googleReviewUrl:'',hours:'',description:'',...b}));
  db.employees = db.employees.map(e=>({role:'',active:true,userId:'',...e}));
  db.tags = db.tags.map(t=>({active:true,...t}));
  db.payments = db.payments.map(p=>({qty:1,...p,amount:Number(p.amount)||0,date:new Date(p.date)}));
  return {
    me: {name:'Admin',...d.me},
    db,
    reviews: (d.reviews||[]).map(r=>({chips:[],msg:'',client:'Invitado',...r,date:new Date(r.date)})).sort((a,b)=>b.date-a.date),
    taps: (d.taps||[]).map(t=>({...t,date:new Date(t.date)})),
  };
}

const themeSwitch = (id, label) => `<button class="theme-btn" id="${id}" role="switch" aria-checked="false" aria-label="Modo oscuro" title="Cambiar a modo oscuro"><span class="tt"><span class="thumb"><svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></span></span>${label ? '<span class="lbl">Modo oscuro</span>' : ''}</button>`;
const LOGO_SVG = '<svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="3.2" fill="#22c55e"/><path d="M12.5 7.5a6.5 6.5 0 0 1 0 9M16 5a10 10 0 0 1 0 14" stroke="#22c55e" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
const escH = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LOGO_W = '<svg viewBox="0 0 24 24"><circle cx="7" cy="12" r="3.2" fill="#fff"/><path d="M12.5 7.5a6.5 6.5 0 0 1 0 9M16 5a10 10 0 0 1 0 14" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>';
const SVG_I = p => '<svg class="i" viewBox="0 0 24 24">' + p + '</svg>';
const TOP_I = {
  search: SVG_I('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  bell: SVG_I('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
  plus: SVG_I('<path d="M12 5v14M5 12h14"/>'),
  out: '<svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"/></svg>',
  biz: '<svg class="i" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>',
  user: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  clock: '<svg class="i" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};
const ini1 = n => escH((String(n || '?').trim()[0] || '?').toUpperCase());
const shellV11 = o => `<div class="app${o.nohead ? ' nohead' : ''}${o.readonly ? ' readonly' : ''}">
<aside class="side">
  <a class="brand" href="${BASE}" aria-label="Toque inicio · ${o.sub}"><span class="wm">${LOGO_SVG}<b>toque</b></span><span class="who">${TOP_I.user}${o.sub}</span></a>
  <nav class="nav" id="nav" aria-label="Secciones"></nav>
  <div class="side-foot"><div class="av" id="sideAv">${ini1(o.name)}</div><div class="sf-t"><b id="sideMe">${escH(o.name)}</b><span id="sideRole">${escH(o.role)}</span></div></div>
</aside>
<div class="col">
<header class="top">
  <a class="m-logo" href="${BASE}" aria-label="Toque inicio">${LOGO_SVG}toque</a>
  ${o.search ? `<label class="tsearch">${TOP_I.search}<input id="q" type="search" placeholder="${o.search}" aria-label="Buscar" autocomplete="off"></label>` : ''}
  <div class="sp"></div>
  <div id="topPer"></div>
  ${o.pill || ''}
  <div class="bellw"><button class="icon-btn bell" id="bell" aria-label="Avisos" aria-haspopup="true" aria-expanded="false">${TOP_I.bell}<i class="dot" hidden></i></button><div class="npanel" id="npanel" hidden></div></div>
  ${themeSwitch('themeBtn', true)}
  <div class="me"><span id="hdrMe">${escH(o.name)}</span><div class="av" id="hdrAv">${ini1(o.name)}</div></div>
  ${o.cta ? `<button class="btn go cta" id="cta" aria-label="${o.cta}">${TOP_I.plus}<span class="lbl">${o.cta}</span></button>` : ''}
  <button class="icon-btn" id="logout" aria-label="Cerrar sesión">${TOP_I.out}</button>
</header>
<main class="main"><div class="wrap" id="view"></div></main>
</div>
<div id="layer"></div>
<div class="themefab">${themeSwitch('themeFab', false)}</div>
</div>`;
const shell = (D, hideHeader) => shellV11({nohead: hideHeader, sub: 'Admin', name: D.me.name, role: 'Administrador · Toque',
  search: 'Buscar usuarios, negocios, empleados…', cta: 'Nuevo negocio'});


function boot(host, root, opts){
  if (!opts.data) throw new Error('ToqueAdmin requiere datos reales');
  const NOW = new Date();
  const D = normalizeAdmin(opts.data);
  const DB = D.db;
  const DATA = {reviews: D.reviews, taps: D.taps};
  const DEMO = '';
  root.innerHTML = '<style>' + CSS + '</style>' + shell(D, host.hasAttribute('hide-header'));
/* periodos (los mismos del panel actual) */
const PERIODS=[['this-month','Este mes'],['last-month','Mes anterior'],['last-30-days','Últimos 30 días'],['all-time','Todo']];
function range(p){
  const y=NOW.getFullYear(),m=NOW.getMonth();
  if(p==='this-month')return[new Date(y,m,1),new Date(y,m+1,1)];
  if(p==='last-month')return[new Date(y,m-1,1),new Date(y,m,1)];
  if(p==='last-30-days')return[new Date(NOW-30*DAY),new Date(+NOW+1)];
  return null;
}
function prevRange(p){
  const y=NOW.getFullYear(),m=NOW.getMonth();
  if(p==='this-month')return[new Date(y,m-1,1),new Date(y,m,1)];
  if(p==='last-month')return[new Date(y,m-2,1),new Date(y,m-1,1)];
  if(p==='last-30-days')return[new Date(NOW-60*DAY),new Date(NOW-30*DAY)];
  return null;
}
const inR=(d,r)=>!r||(d>=r[0]&&d<r[1]);
/* buena ≥4 · mala ≤2 · 3 neutra · puntos = buenas − malas × 1,5 */
function stats(list){
  const t=list.length,g=list.filter(r=>r.rating>=4).length,b=list.filter(r=>r.rating<=2).length;
  const avg=t?list.reduce((s,r)=>s+r.rating,0)/t:0;
  return{t,g,b,n:t-g-b,avg,pg:t?Math.round(g/t*100):0,pb:t?Math.round(b/t*100):0,pts:g-b*1.5,
    dist:[5,4,3,2,1].map(s=>list.filter(r=>r.rating===s).length)};
}
function rankFor(p){
  const r=range(p);
  return DATA.employees.map(e=>({e,s:stats(DATA.reviews.filter(x=>x.emp===e.id&&inR(x.date,r)))}))
    .sort((a,b)=>b.s.pts-a.s.pts||b.s.avg-a.s.avg||b.s.t-a.s.t);
}
const fmtDate=d=>{const days=Math.floor((NOW-d)/DAY);if(days===0)return'Hoy';if(days===1)return'Ayer';if(days<7)return`Hace ${days} días`;return d.toLocaleDateString('es',{day:'numeric',month:'short'});};
const fmt1=n=>n.toFixed(1).replace('.',',');
const pts=n=>(Number.isInteger(n)?n:n.toFixed(1).replace('.',','));

const reviewsOf=bid=>{const ids=new Set(DB.employees.filter(e=>e.businessId===bid).map(e=>e.id));return DATA.reviews.filter(r=>ids.has(r.emp));};
const tapsOf=bid=>{const ids=new Set(DB.tags.filter(t=>t.businessId===bid).map(t=>t.id));return DATA.taps.filter(t=>ids.has(t.tag));};
const ROLES={user:'Usuario',employee:'Empleado',business:'Negocio',admin:'Admin'};
const STATUS={community:['Comunidad',''],claim_pending:['Por verificar','a'],verified:['Verificado','g'],premium:['Premium','g']};
const PAY={pending:['Pendiente','a'],approved:['Aprobado','g'],rejected:['Rechazado','r'],expired:['Expirado',''],failed:['Fallido','r']};
const PROD={tag_a:'Tag Tipo A',plan_starter:'Plan Starter',plan_business:'Plan Negocio',plan_business_plus:'Plan Negocio Plus',plan_enterprise:'Plan Empresarial'};

const $=s=>root.querySelector(s);
const H=()=>host.hooks||{};

const THEME_KEY='toque-theme-v2';
const sysDark=()=>{const d=document.documentElement.getAttribute('data-theme');if(d==='dark')return true;if(d==='light')return false;try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch{return false;}};
const storedTheme=()=>{try{const s=localStorage.getItem(THEME_KEY);return s==='dark'||s==='light'?s:null;}catch{return null;}};
const attrTheme=()=>{const a=host.getAttribute('theme');return a==='dark'||a==='light'?a:null;};
let theme=storedTheme()||attrTheme()||(sysDark()?'dark':'light');
const motionOK=()=>{if(host.hasAttribute('no-motion'))return false;try{return !matchMedia('(prefers-reduced-motion: reduce)').matches;}catch{return true;}};
function paintTheme(){const dark=theme==='dark';$('.app').classList.toggle('dark',dark);
  root.querySelectorAll('.theme-btn').forEach(b=>{b.setAttribute('aria-checked',String(dark));b.title=dark?'Cambiar a modo claro':'Cambiar a modo oscuro';});}
function setTheme(t,persist){if(t!=='dark'&&t!=='light')return;theme=t;paintTheme();
  if(persist){try{localStorage.setItem(THEME_KEY,t);}catch{}host.dispatchEvent(new CustomEvent('toque:themechange',{detail:{theme:t},bubbles:true,composed:true}));}}
root.querySelectorAll('.theme-btn').forEach(b=>b.onclick=()=>setTheme(theme==='dark'?'light':'dark',true));
const onStorage=e=>{if(e.key===THEME_KEY&&(e.newValue==='dark'||e.newValue==='light'))setTheme(e.newValue,false);};
const onSibling=e=>{const t=e.detail&&e.detail.theme;if(t&&e.target!==host)setTheme(t,false);};
window.addEventListener('storage',onStorage);window.addEventListener('toque:themechange',onSibling);
paintTheme();
/* contadores animados de los KPI (solo al entrar a una vista; el texto final es exactamente el original) */
let raf=0;
function countUp(){cancelAnimationFrame(raf);if(!motionOK())return;
  const items=[];
  root.querySelectorAll('.kpi b').forEach(b=>{const node=[...b.childNodes].find(n=>n.nodeType===3&&/\d/.test(n.nodeValue));if(!node)return;
    const m=node.nodeValue.match(/^(\D*)(\d+(?:[.,]\d+)?)([\s\S]*)$/);if(!m)return;
    const sep=/[.,]/.exec(m[2])?.[0]||'.',dec=(m[2].split(/[.,]/)[1]||'').length,val=parseFloat(m[2].replace(',','.'));
    if(!isFinite(val)||val===0)return;items.push({node,orig:node.nodeValue,pre:m[1],post:m[3],sep,dec,val});});
  if(!items.length)return;
  const t0=performance.now(),dur=900;
  const tick=now=>{const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);
    items.forEach(it=>{if(!it.node.isConnected)return;
      it.node.nodeValue=k>=1?it.orig:it.pre+(it.dec?(it.val*e).toFixed(it.dec).replace('.',it.sep):String(Math.round(it.val*e)))+it.post;});
    if(k<1)raf=requestAnimationFrame(tick);};
  items.forEach(it=>{const v0=it.val*0.35;it.node.nodeValue=it.pre+(it.dec?v0.toFixed(it.dec).replace('.',it.sep):String(Math.round(v0)))+it.post;});
  raf=requestAnimationFrame(tick);}
let shownKey=null;
function render(){nav();const key=viewKey(),fresh=key!==shownKey;shownKey=key;const v=$('#view');
  if(fresh)v.setAttribute('data-enter','');else v.removeAttribute('data-enter');
  v.innerHTML=V[cur]();wire[cur]&&wire[cur]();afterRender();if(fresh)countUp();}

/* ===== V11: utilidades de interfaz (gráficos, dona, avatares, avisos, barra superior) ===== */
const CHARTS=new Map(),SER=new Map();
const AV_T=['blue','violet','green','amber','rose','cyan'];
const avTone=s=>{let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return AV_T[h%AV_T.length];};
const cap=s=>s?s[0].toUpperCase()+s.slice(1):s;
function paintAvatars(){root.querySelectorAll('.ini:not(.biz):not(.all)').forEach(el=>{if(!el.querySelector('img'))el.dataset.tone=avTone(el.textContent.trim());});}
const kpiH=(tone,icon,label,val,foot='',to='')=>{const t=to?'button':'div';return `<${t} class="kpi" ${to?`data-to="${to}"`:''}><div class="kh"><span>${label}</span><i class="kc ${tone}" aria-hidden="true">${ic(icon)}</i></div><b>${val}</b>${foot}</${t}>`;};
function weeks(n){const out=[];for(let w=n-1;w>=0;w--){const b=new Date(+NOW-w*7*DAY+1),a=new Date(+b-7*DAY);out.push({a,b,lab:w===0?'Esta sem.':a.toLocaleDateString('es',{day:'numeric',month:'short'})});}return out;}
const inW=(d,w)=>d>=w.a&&d<w.b;
const serSel=(id,d)=>SER.get(id)||d;
const serSeg=(id,opts)=>{const c=serSel(id,opts[0][0]);return `<div class="seg" data-series-for="${id}" role="group" aria-label="Dato del gráfico">${opts.map(([k,l])=>`<button data-s="${k}" class="${k===c?'on':''}" aria-pressed="${k===c}">${l}</button>`).join('')}</div>`;};
function donutH(parts,center,sub){const tot=parts.reduce((a,p)=>a+p.v,0),R=52,C=2*Math.PI*R,gap=parts.filter(p=>p.v).length>1?3:0;let acc=0;
  const segs=tot?parts.map(p=>{if(!p.v)return'';const len=p.v/tot*C;const s=`<circle class="sgc" cx="60" cy="60" r="${R}" style="stroke:var(--c-${p.tone})" stroke-dasharray="${Math.max(.5,len-gap).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-acc).toFixed(2)}"/>`;acc+=len;return s;}).join(''):'';
  return `<div class="donut"><div class="dwrap"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="bgc" cx="60" cy="60" r="${R}"/>${segs}</svg><div class="dc"><b>${center}</b><span>${sub}</span></div></div>
  <div class="dleg">${parts.map(p=>`<div><i style="--tone:var(--c-${p.tone})"></i><span>${p.l}</span><b>${tot?Math.round(p.v/tot*100):0}%<small>(${p.v})</small></b></div>`).join('')}</div></div>`;}
const feedH=items=>items.length?`<ul class="feed">${items.map(x=>`<li class="fi"><i class="ic ${x.tone}" aria-hidden="true">${ic(x.i)}</i><div><b>${x.t}</b>${x.s?`<span>${x.s}</span>`:''}</div>${x.d?`<time>${fmtDate(x.d)}</time>`:''}</li>`).join('')}</ul>`:empty('inbox','Sin actividad todavía','Cuando haya taps, reseñas o pagos aparecerán aquí.');
function niceMax(m){if(m<=4)return 4;const p=Math.pow(10,Math.floor(Math.log10(m))),f=m/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p;}
function drawArea(el){const cfg=CHARTS.get(el.dataset.chart);if(!cfg)return;const ser=cfg.series[cfg.cur]||Object.values(cfg.series)[0];if(!ser)return;
  const W=Math.max(240,Math.round(el.clientWidth)),Hh=Math.round(el.clientHeight)||230,pl=38,pr=14,pt=14,pb=26,n=ser.v.length;
  const vals=ser.v.filter(v=>v!=null),top=ser.max||niceMax((Math.max(0,...vals)||1)*1.1);
  const X=i=>pl+(n<2?(W-pl-pr)/2:(W-pl-pr)*i/(n-1)),Y=v=>pt+(Hh-pt-pb)*(1-v/top);
  const fmt=v=>ser.fmt?ser.fmt(v):(Number.isInteger(v)?String(v):fmt1(v));
  let g='';for(let k=0;k<=4;k++){const v=top*k/4,y=Y(v).toFixed(1);g+=`<line class="gl" x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}"/><text class="ax" x="${pl-8}" y="${(+y+3.5).toFixed(1)}" text-anchor="end">${esc(fmt(v))}</text>`;}
  const step=Math.max(1,Math.ceil(n/Math.max(2,Math.floor((W-pl-pr)/70))));
  let xl='';cfg.labels.forEach((l,i)=>{if((n-1-i)%step===0)xl+=`<text class="ax" x="${X(i).toFixed(1)}" y="${Hh-6}" text-anchor="middle">${esc(l)}</text>`;});
  const runs=[];let run=[];ser.v.forEach((v,i)=>{if(v==null){if(run.length)runs.push(run);run=[];}else run.push([X(i),Y(v)]);});if(run.length)runs.push(run);
  const curve=p=>p.map((q,i)=>i?`C${((p[i-1][0]+q[0])/2).toFixed(1)} ${p[i-1][1].toFixed(1)} ${((p[i-1][0]+q[0])/2).toFixed(1)} ${q[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`:`M${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join('');
  const gid='ag-'+el.dataset.chart,y0=Y(0).toFixed(1);
  const areas=runs.map(r=>`<path d="${curve(r)}L${r[r.length-1][0].toFixed(1)} ${y0}L${r[0][0].toFixed(1)} ${y0}Z" fill="url(#${gid})"/>`).join('');
  const lines=runs.map(r=>`<path class="ln" d="${curve(r)}"/>`).join('');
  const lastI=ser.v.reduce((a,v,i)=>v==null?a:i,-1);
  const dots=ser.v.map((v,i)=>v==null?'':`<circle class="pt${i===lastI?' last':''}" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${i===lastI?4.5:3.5}"/>`).join('');
  const aria=esc(ser.name)+': '+ser.v.map((v,i)=>esc(cfg.labels[i])+' '+(v==null?'sin datos':esc(fmt(v)))).join(', ');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${aria}"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--chart);stop-opacity:.34"/><stop offset="1" style="stop-color:var(--chart);stop-opacity:0"/></linearGradient></defs>${g}${areas}${lines}<line class="xh" y1="${pt}" y2="${y0}" x1="-99" x2="-99"/>${dots}${xl}<rect x="${pl}" y="0" width="${W-pl-pr}" height="${Hh}" fill="transparent"/></svg><div class="ctip" hidden></div>`;
  const svg=el.querySelector('svg'),tip=el.querySelector('.ctip'),xh=el.querySelector('.xh');
  svg.onpointermove=e=>{const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)*(W/r.width);let i=Math.round((x-pl)/((W-pl-pr)/Math.max(1,n-1)));i=Math.max(0,Math.min(n-1,i));
    const v=ser.v[i];xh.setAttribute('x1',X(i));xh.setAttribute('x2',X(i));tip.hidden=false;
    tip.innerHTML=`${v==null?'Sin datos':esc(fmt(v))}<span>${esc(cfg.labels[i])} · ${esc(ser.name)}</span>`;
    tip.style.left=(X(i)/W*100)+'%';tip.style.top=((v==null?Y(0):Y(v))/Hh*100)+'%';};
  svg.onpointerleave=()=>{tip.hidden=true;xh.setAttribute('x1',-99);xh.setAttribute('x2',-99);};
}
const CHEV_L='<svg class="i" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',CHEV_R='<svg class="i" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';
const carH=(title,sub,inner)=>`<section class="card rvc"><div class="card-h"><div><h2>${title}</h2><p>${sub}</p></div><div class="carnav"><button class="icon-btn" data-car="-1" aria-label="Ver anteriores">${CHEV_L}</button><button class="icon-btn" data-car="1" aria-label="Ver siguientes">${CHEV_R}</button></div></div><div class="rv-car" tabindex="0" role="region" aria-label="${title}: carrusel, usa las flechas del teclado para moverte">${inner}</div></section>`;
function carState(el){const nav=el.closest('.card')?.querySelector('.carnav');if(!nav)return;const max=el.scrollWidth-el.clientWidth-2;
  nav.querySelector('[data-car="-1"]').disabled=el.scrollLeft<=2;nav.querySelector('[data-car="1"]').disabled=el.scrollLeft>=max;nav.hidden=max<=0;}
function carWire(el){let x0=0,s0=0,down=false,moved=false;
  el.onpointerdown=e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('button,a,input'))return;down=true;moved=false;x0=e.clientX;s0=el.scrollLeft;};
  el.onpointermove=e=>{if(!down)return;const dx=e.clientX-x0;if(!moved&&Math.abs(dx)>5){moved=true;el.classList.add('drag');try{el.setPointerCapture(e.pointerId);}catch{}}if(moved)el.scrollLeft=s0-dx;};
  const end=()=>{if(!down)return;down=false;if(moved)el.classList.remove('drag');};
  el.onpointerup=end;el.onpointercancel=end;el.onscroll=()=>carState(el);carState(el);}
let ro=null;const roW=new WeakMap();
function drawCharts(){const els=[...root.querySelectorAll('.achart[data-chart]')];ro&&ro.disconnect();els.forEach(drawArea);
  if(typeof ResizeObserver==='function'&&els.length){ro=new ResizeObserver(es=>es.forEach(e=>{const w=Math.round(e.contentRect.width);if(roW.get(e.target)!==w){roW.set(e.target,w);drawArea(e.target);}}));
    els.forEach(e=>{roW.set(e,Math.round(e.clientWidth));ro.observe(e);});}}
function bellPaint(){const b=$('#bell');if(!b||typeof notifs!=='function')return;const n=notifs().length;b.querySelector('.dot').hidden=!n;b.setAttribute('aria-label',n?`Avisos (${n})`:'Avisos');}
function bellToggle(force){const w=$('#npanel');if(!w)return;const open=force===undefined?w.hidden:force;if(!open){w.hidden=true;$('#bell').setAttribute('aria-expanded','false');return;}
  const list=notifs();w.innerHTML=`<h3>Avisos</h3>`+(list.length?list.map((x,i)=>`<button data-n="${i}"><i class="kc ${x.tone}" aria-hidden="true">${ic(x.i)}</i><div><b>${x.t}</b>${x.s?`<span>${x.s}</span>`:''}</div></button>`).join(''):'<div class="none">Todo al día. No hay avisos nuevos.</div>');
  w.hidden=false;$('#bell').setAttribute('aria-expanded','true');
  w.querySelectorAll('[data-n]').forEach(btn=>btn.onclick=()=>{const x=list[+btn.dataset.n];bellToggle(false);x.act?x.act():go(x.to);});}
const onRootClick=e=>{const w=$('#npanel');if(w&&!w.hidden&&!e.composedPath().some(n=>n&&(n.id==='npanel'||n.id==='bell')))bellToggle(false);};
const onRootEsc=e=>{if(e.key==='Escape'){const w=$('#npanel');if(w&&!w.hidden){bellToggle(false);$('#bell').focus();}}};
root.addEventListener('click',onRootClick);root.addEventListener('keydown',onRootEsc);
let topWired=false,searchTimer=0;
function wireTop(){topWired=true;
  const b=$('#bell');if(b)b.onclick=()=>bellToggle();
  const q=$('#q');if(q&&typeof onSearch==='function')q.oninput=e=>{clearTimeout(searchTimer);const value=e.target.value;searchTimer=setTimeout(()=>onSearch(value),180);};
  const c=$('#cta');if(c&&typeof ctaAction==='function')c.onclick=()=>ctaAction();}
function afterRender(){if(!topWired)wireTop();
  root.querySelectorAll('.rv-car').forEach(carWire);
  root.querySelectorAll('[data-car]').forEach(b=>b.onclick=()=>{const c=b.closest('.card').querySelector('.rv-car');if(c)c.scrollBy({left:+b.dataset.car*c.clientWidth*.85,behavior:motionOK()?'smooth':'auto'});});paintAvatars();if(typeof topSlot==='function')topSlot();drawCharts();bellPaint();
  root.querySelectorAll('[data-series-for] button').forEach(b=>b.onclick=()=>{const id=b.parentElement.dataset.seriesFor;SER.set(id,b.dataset.s);const c=CHARTS.get(id);if(c)c.cur=b.dataset.s;
    b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b));});
    const el=root.querySelector(`.achart[data-chart="${id}"]`);el&&drawArea(el);});}

let uidN=0;const uid=p=>p+Date.now().toString(36)+(++uidN);
let pending=false;
/* Ejecuta el hook del padre (si existe) y SOLO si no falla aplica el cambio local.
   El hook puede devolver un objeto con datos del servidor (ids, urls) que se mezclan. */
async function commit(name,payload,apply,okMsg){
  if(pending)return false;
  pending=true;
  try{
    let res;
    if(typeof H()[name]==='function')res=await H()[name](payload);
    apply(res||{});
  }catch(err){
    console.error('[toque-admin] '+name,err);
    pending=false;toast(err?.userMessage||'No se pudo completar la acción. Inténtalo de nuevo.');return false;
  }
  pending=false;
  if(!dead){render();okMsg&&toast(okMsg);}
  return true;
}
async function copyText(t){try{await navigator.clipboard.writeText(t);return true;}catch{
  try{const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok;}catch{return false;}}}
const scrollTop=()=>{const t=host.getBoundingClientRect().top;if(t<0)window.scrollTo({top:window.scrollY+t});};
const statusOf=s=>STATUS[s]||[esc(s||'—'),''];
const payOf=s=>PAY[s]||[esc(s||'—'),''];
const prodOf=p=>PROD[p]||p||'—';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ini=n=>esc(String(n||'?').split(' ').filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?');
const user=id=>DB.users.find(u=>u.id===id);
const biz=id=>DB.businesses.find(b=>b.id===id);
const empsOf=bid=>DB.employees.filter(e=>e.businessId===bid);
const money=n=>'$'+(Number(n)||0).toFixed(2);
const I={
  team:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  pulse:'<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  star:'<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/>',
  dash:'<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z"/>',
  inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  biz:'<path d="M3 21h18M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6M9 10h.01M15 10h.01"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  back:'<path d="M19 12H5M12 19l-7-7 7-7"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  x:'<path d="M18 6L6 18M6 6l12 12"/>',
  msg:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  nfc:'<circle cx="6" cy="12" r="2"/><path d="M10 8a6 6 0 0 1 0 8M14 5a10 10 0 0 1 0 14"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
};
const KPI_IC={'Usuarios':'users','Negocios':'biz','Empleados':'users','Reseñas':'msg','Taps NFC':'nfc','Pagos aprobados':'card','Pendientes':'inbox'};
const ic=(k,st='')=>`<svg class="i" viewBox="0 0 24 24" ${st}>${I[k]}</svg>`;
const STAR='<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/>';
const starsH=n=>`<span class="stars" aria-label="${n} de 5 estrellas">${[1,2,3,4,5].map(i=>`<svg viewBox="0 0 24 24" class="${i<=n?'':'off'}">${STAR}</svg>`).join('')}</span>`;

const MODS=[
  {k:'dash',t:'Resumen',s:'Inicio',i:'dash',g:'Menú'},
  {k:'req',t:'Solicitudes',s:'Solicitudes',i:'inbox',g:'Menú',c:()=>DB.requests.length,hot:true},
  {k:'biz',t:'Negocios',s:'Negocios',i:'biz',g:'Menú',c:()=>DB.businesses.length},
  {k:'users',t:'Usuarios',s:'Usuarios',i:'users',g:'Menú',c:()=>DB.users.length},
  {k:'emps',t:'Empleados',s:'Equipo',i:'team',g:'Menú',c:()=>DB.employees.length},
  {k:'tags',t:'Tags NFC',s:'NFC',i:'nfc',g:'Menú',c:()=>DB.tags.length},
  {k:'revs',t:'Reseñas',s:'Reseñas',i:'msg',g:'Menú',c:()=>DATA.reviews.length},
  {k:'pay',t:'Pagos',s:'Pagos',i:'card',g:'Menú',c:()=>DB.payments.length},
  {k:'act',t:'Actividad',s:'Actividad',i:'pulse',g:'Sistema',live:true},
];
let dead=false,cur='dash',bizOpen=null,bizTab='team',userQ='',userRole='all',closed=new Set(),reqF='all',payF='all',period='all-time',topQ='',empF='all',tagF='all',revF='all',actF='all',moreOpen=false;
function nav(){let g='';
  const items=MODS.map((m,i)=>{const n=m.c?m.c():null;const sec=m.g!==g?(g=m.g,`<small class="nav-sec">${m.g}</small>`):'';
    return sec+`<button class="${cur===m.k?'on':''}${i>=4?' mobile-extra':''}" data-k="${m.k}" aria-current="${cur===m.k?'page':'false'}">${ic(m.i)}<span class="lbl-l">${m.t}</span><span class="lbl-s">${m.s}</span>${m.live?'<span class="cnt live">En vivo</span>':n!==null?`<span class="cnt ${m.hot&&n>0?'hot':''}">${n}</span>`:''}</button>`}).join('');
  $('#nav').classList.toggle('more-open',moreOpen);
  $('#nav').innerHTML=items+`<button class="nav-more" type="button" aria-expanded="${moreOpen}" aria-label="Mostrar más secciones">${ic('plus')}<span class="lbl-s">Más</span></button>`;
  $('#nav').querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{moreOpen=false;go(b.dataset.k);});
  $('.nav-more').onclick=e=>{moreOpen=!moreOpen;$('#nav').classList.toggle('more-open',moreOpen);e.currentTarget.setAttribute('aria-expanded',String(moreOpen));};
}
function go(k,opt){cur=k;bizOpen=opt??null;if(opt)bizTab='team';render();scrollTop();}
const viewKey=()=>cur+'|'+(bizOpen||'')+'|'+(bizOpen?bizTab:'')+'|'+period;
const head=(t,p,act='')=>`<div class="head"><div><h1>${t}</h1>${p?`<p>${p}</p>`:''}</div>${act}</div>`;
const empty=(i,t,s)=>`<div class="empty">${ic(i)}<b>${t}</b>${s}</div>`;
const PER_LABEL={'this-month':'este mes','last-month':'el mes anterior','last-30-days':'los últimos 30 días','all-time':'todo el tiempo'};
const periodSeg=()=>`<div class="seg" id="perSeg" role="group" aria-label="Periodo">${PERIODS.map(([k,l])=>`<button data-p="${k}" class="${period===k?'on':''}">${l}</button>`).join('')}</div>`;
const PER_VIEWS=['dash'];
const isNohead=()=>$('.app').classList.contains('nohead');
const perHead=()=>isNohead()&&PER_VIEWS.includes(cur)?periodSeg():'';
function perWire(){root.querySelectorAll('#perSeg button').forEach(b=>b.onclick=()=>{period=b.dataset.p;render();});}
function topSlot(){const t=$('#topPer');if(t)t.innerHTML=!isNohead()&&PER_VIEWS.includes(cur)?periodSeg():'';perWire();}
function dl(c,p,isMoney){if(p==null)return'';const d=c-p;if(Math.abs(d)<.005)return'<small>Igual que el periodo anterior</small>';const up=d>0;
  return `<small class="${up?'up':'down'}"><em>${up?'▲':'▼'} ${isMoney?money(Math.abs(d)):Math.abs(Math.round(d))}</em> vs periodo anterior</small>`;}
const empName=id=>DB.employees.find(e=>e.id===id)?.name;
const bizOfEmp=id=>biz(DB.employees.find(e=>e.id===id)?.businessId)?.name;
const tq=()=>topQ.toLowerCase();
const has=(...xs)=>!topQ||xs.join(' ').toLowerCase().includes(tq());
const bq=b=>has(b.name,user(b.ownerId)?.name,b.city,b.category);
/* barra superior */
const SEARCHABLE=['users','biz','emps','tags','revs','pay'];
function onSearch(v){topQ=v.trim();userQ=topQ;if(cur==='biz'&&bizOpen)go('biz');else if(!SEARCHABLE.includes(cur))go('users');else render();}
function ctaAction(){bizForm();}
function notifs(){const out=[];
  DB.requests.forEach(r=>out.push(r.type==='business'?{tone:'green',i:'biz',t:`${esc(r.name)} pide registrarse como negocio`,s:`Solicita ${esc(r.by||'—')}`,to:'req'}:{tone:'violet',i:'team',t:`${esc(r.name)} quiere unirse a ${esc(biz(r.businessId)?.name||'un negocio')}`,s:esc(r.job||'Empleado'),to:'req'}));
  DB.businesses.filter(b=>b.status==='claim_pending').forEach(b=>out.push({tone:'amber',i:'biz',t:`${esc(b.name)} está por verificar`,s:'Revisa los datos y verifícalo',act:()=>go('biz',b.id)}));
  const pend=DB.payments.filter(p=>p.status==='pending').length;
  if(pend)out.push({tone:'amber',i:'card',t:`${pend} ${pend===1?'pago pendiente':'pagos pendientes'}`,s:'Esperando confirmación',act:()=>{payF='pending';go('pay');}});
  const fail=DB.payments.filter(p=>p.status==='failed').length;
  if(fail)out.push({tone:'rose',i:'card',t:`${fail} ${fail===1?'pago fallido':'pagos fallidos'}`,s:'Revisa con el cliente',act:()=>{payF='failed';go('pay');}});
  const off=DB.tags.filter(t=>!t.active).length;
  if(off)out.push({tone:'blue',i:'nfc',t:`${off} ${off===1?'tag NFC inactivo':'tags NFC inactivos'}`,s:'No llevan a ninguna reseña',act:()=>{tagF='off';go('tags');}});
  return out;}
function events(){
  const ev=[...DATA.reviews.map(r=>({k:'rev',d:r.date,tone:r.rating>=4?'green':r.rating<=2?'rose':'amber',i:'star',t:`${r.rating}★ para ${esc(empName(r.emp)||'Empleado')}`,s:`${esc(bizOfEmp(r.emp)||'—')}${r.msg?' · “'+esc(r.msg)+'”':''}`})),
    ...DB.payments.map(p=>{const st=payOf(p.status);return{k:'pay',d:p.date,tone:st[1]==='g'?'green':st[1]==='a'?'amber':st[1]==='r'?'rose':'blue',i:'card',t:`${money(p.amount)} · ${esc(prodOf(p.product))}`,s:`${esc(p.business)} · ${st[0]}`};}),
    ...DATA.taps.map(t=>{const tg=DB.tags.find(x=>x.id===t.tag);return{k:'tap',d:t.date,tone:tg?.type==='business_google'?'blue':'violet',i:'nfc',t:`Tap en ${esc(tg?.label||'un tag')}`,s:esc(biz(tg?.businessId)?.name||'—')};})];
  return ev.filter(x=>x.d instanceof Date&&!isNaN(x.d)).sort((a,b)=>b.d-a.d);}
const sw=(attr,id,on,label)=>`<button class="switch ${on?'on':''}" ${attr}="${id}" role="switch" aria-checked="${on}" aria-label="${label}"></button>`;
const segH=(id,state,opts)=>`<div class="tools"><div class="seg" id="${id}">${opts.map(([k,l,n])=>`<button data-f="${k}" class="${state===k?'on':''}">${l}${n!==undefined?' · '+n:''}</button>`).join('')}</div></div>`;

const V={
dash(){
  const r=range(period),pr=prevRange(period);
  const rv=DATA.reviews.filter(x=>inR(x.date,r)),s=stats(rv),prv=pr?DATA.reviews.filter(x=>inR(x.date,pr)):null;
  const okP=DB.payments.filter(p=>p.status==='approved'),sum=l=>l.reduce((a,p)=>a+(+p.amount||0),0);
  const okR=okP.filter(p=>inR(p.date,r)),paid=sum(okR),ppaid=pr?sum(okP.filter(p=>inR(p.date,pr))):null;
  const owners=new Set(DB.businesses.map(b=>b.ownerId).filter(Boolean)).size;
  const ver=DB.businesses.filter(b=>b.status==='verified'||b.status==='premium').length;
  const wk=weeks(10);
  CHARTS.set('adm',{labels:wk.map(w=>w.lab),cur:serSel('adm','rev'),series:{
    rev:{name:'Reseñas',v:wk.map(w=>DATA.reviews.filter(x=>inW(x.date,w)).length)},
    taps:{name:'Taps',v:wk.map(w=>DATA.taps.filter(x=>inW(x.date,w)).length)},
    pay:{name:'Pagos aprobados',fmt:v=>'$'+(v>=1000?(v/1000).toFixed(1).replace('.0','')+'k':Math.round(v)),v:wk.map(w=>sum(okP.filter(p=>inW(p.date,w))))}}});
  const reqs=DB.requests.slice(0,5);
  return head('Resumen','Toda la plataforma · '+PER_LABEL[period]+DEMO,perHead())+
  `<div class="kpis">${kpiH('blue','card','Pagos aprobados',money(paid),pr?dl(paid,ppaid,true):`<small>${okR.length} ${okR.length===1?'pago':'pagos'}</small>`,'pay')}${kpiH('violet','users','Usuarios',DB.users.length,`<small>${owners} ${owners===1?'dueño':'dueños'} · ${DB.employees.length} empleados</small>`,'users')}${kpiH('green','biz','Negocios',DB.businesses.length,`<small>${ver} verificados</small>`,'biz')}${kpiH('amber','star','Reseñas',s.t,pr?dl(s.t,prv.length):`<small>${s.t?fmt1(s.avg)+'★ promedio':'Sin reseñas'}</small>`,'revs')}</div>
  <div class="g21">
    <section class="card"><div class="card-h"><div><h2>Actividad de la plataforma</h2><p>Últimas 10 semanas</p></div>${serSeg('adm',[['rev','Reseñas'],['taps','Taps'],['pay','Pagos']])}</div><div class="pad"><div class="achart" data-chart="adm"></div></div></section>
    <section class="card"><div class="card-h"><div><h2>Distribución de reseñas</h2><p>${cap(PER_LABEL[period])}</p></div></div><div class="pad">${s.t?donutH([{l:'Buenas (4–5★)',v:s.g,tone:'green'},{l:'Regulares (3★)',v:s.n,tone:'blue'},{l:'Malas (1–2★)',v:s.b,tone:'rose'}],s.pg+'%','buenas'):empty('chart','Sin reseñas en este periodo','')}</div></section>
  </div>
  <div class="g21">
    <section class="card"><div class="card-h"><div><h2>Solicitudes recientes</h2><p>Negocios nuevos y personas que quieren unirse</p></div><button class="lk" data-to="req">Ver todas</button></div>
      ${reqs.length?`<div class="tbl"><table><thead><tr><th>Solicitante</th><th>Tipo</th><th class="hide-m">Detalle</th><th></th></tr></thead><tbody>${reqs.map(q=>`<tr><td><div class="emp"><div class="ini ${q.type==='business'?'biz':''}">${ini(q.name)}</div><div><b>${esc(q.name)}</b><span>${esc(q.type==='business'?(q.by||''):q.email)}</span></div></div></td><td><span class="tag ${q.type==='business'?'g':'b'}">${q.type==='business'?'Nuevo negocio':'Empleado'}</span></td><td class="hide-m mut">${q.type==='business'?esc([q.category,q.city].filter(Boolean).join(' · ')):esc((biz(q.businessId)?.name||'—')+(q.job?' · '+q.job:''))}</td><td><div class="acts"><button class="btn sm" data-rej="${q.id}">Rechazar</button><button class="btn sm go" data-ok="${q.id}">${ic('check')}Aprobar</button></div></td></tr>`).join('')}</tbody></table></div>`:empty('check','Todo al día','No hay solicitudes pendientes.')}</section>
    <section class="card"><div class="card-h"><div><h2>Registro en vivo</h2><p>Lo último en la plataforma</p></div><span class="live">En vivo</span></div>${feedH(events().slice(0,6))}</section>
  </div>
  <section class="card"><div class="card-h"><div><h2>Negocios</h2><p>Rendimiento de cada negocio</p></div><button class="lk" data-to="biz">Ver todos</button></div><div class="tbl"><table><thead><tr><th>Negocio</th><th class="num">Empleados</th><th class="num">Reseñas</th><th class="num">Promedio</th><th class="num hide-m">Taps</th><th class="hide-m">Estado</th></tr></thead><tbody>
    ${DB.businesses.map(b=>{const st=statusOf(b.status);const rs=stats(reviewsOf(b.id));return `<tr data-b="${esc(b.id)}" style="cursor:pointer"><td><div class="emp"><div class="ini biz">${ini(b.name)}</div><div><b>${esc(b.name)}</b><span>${esc(user(b.ownerId)?.name||'Sin dueño')}</span></div></div></td><td class="num">${empsOf(b.id).length}</td><td class="num">${rs.t}</td><td class="num">${fmt1(rs.avg)}★</td><td class="num hide-m">${tapsOf(b.id).length}</td><td class="hide-m"><span class="tag ${st[1]}">${st[0]}</span></td></tr>`}).join('')}</tbody></table></div></section>`;
},
emps(){
  const all=DB.employees,list=all.filter(e=>(empF==='all'||(empF==='on'?e.active:!e.active))&&has(e.name,e.role,biz(e.businessId)?.name,user(e.userId)?.email));
  return head('Empleados',`${all.length} ${all.length===1?'persona':'personas'} en ${DB.businesses.length} ${DB.businesses.length===1?'negocio':'negocios'}${DEMO}`)+
  segH('empSeg',empF,[['all','Todos',all.length],['on','Activos',all.filter(e=>e.active).length],['off','Inactivos',all.filter(e=>!e.active).length]])+
  `<section class="card">${list.length?`<div class="tbl"><table><thead><tr><th>Empleado</th><th>Negocio</th><th class="hide-m">Cargo</th><th class="num hide-m">Valoraciones</th><th class="num">Promedio</th><th>Activo</th><th></th></tr></thead><tbody>${list.map(e=>{const u=user(e.userId),es=stats(DATA.reviews.filter(r=>r.emp===e.id));
    return `<tr><td><div class="emp"><div class="ini">${ini(e.name)}</div><div><b>${esc(e.name)}</b><span>${u?esc(u.email):'sin cuenta vinculada'}</span></div></div></td><td>${esc(biz(e.businessId)?.name||'—')}</td><td class="hide-m">${esc(e.role||'Colaborador')}</td><td class="num hide-m">${es.t}</td><td class="num">${es.t?fmt1(es.avg)+'★':'—'}</td><td>${sw('data-act',e.id,e.active,'Activo')}</td><td><div class="acts"><button class="btn sm" data-copy-emp="${e.id}" aria-label="Copiar link NFC">${ic('nfc')}<span class="hide-m">Link NFC</span></button><button class="btn sm" data-edit-emp="${e.id}" aria-label="Editar ${esc(e.name)}">${ic('edit')}<span class="hide-m">Editar</span></button><button class="btn sm ghost del" data-del-emp="${e.id}" aria-label="Eliminar ${esc(e.name)}">${ic('trash')}</button></div></td></tr>`;}).join('')}</tbody></table></div>`:empty('users','Sin empleados con este filtro','')}</section>`;
},
tags(){
  const all=DB.tags,isG=t=>t.type==='business_google';
  const list=all.filter(t=>(tagF==='all'||(tagF==='google'?isG(t):tagF==='emp'?!isG(t):!t.active))&&has(t.label,biz(t.businessId)?.name));
  return head('Tags NFC',`${all.length} tags · ${all.filter(t=>t.active).length} activos${DEMO}`)+
  segH('tagSeg',tagF,[['all','Todos',all.length],['google','Google (Tipo A)',all.filter(isG).length],['emp','Empleados (Tipo B)',all.filter(t=>!isG(t)).length],['off','Inactivos',all.filter(t=>!t.active).length]])+
  `<section class="card">${list.length?`<div class="tbl"><table><thead><tr><th>Tag</th><th class="hide-m">Negocio</th><th>Tipo</th><th class="num">Lecturas</th><th>Activo</th><th></th></tr></thead><tbody>${list.map(t=>{const n=DATA.taps.filter(x=>x.tag===t.id).length;
    return `<tr><td><div class="emp"><i class="kc ${isG(t)?'blue':'violet'}" aria-hidden="true">${ic('nfc')}</i><div><b>${esc(t.label)}</b><span><code>/nfc/••••${esc(t.id)}</code></span></div></div></td><td class="hide-m">${esc(biz(t.businessId)?.name||'—')}</td><td><span class="tag ${isG(t)?'b':''}">${isG(t)?'Google':'Empleado'}</span></td><td class="num">${n}</td><td>${sw('data-tag',t.id,t.active,'Tag activo')}</td><td><div class="acts"><button class="btn sm" data-copy-tag="${t.id}" aria-label="Copiar link">${ic('copy')}<span class="hide-m">Copiar</span></button><button class="btn sm" data-edit-tag="${t.id}" aria-label="Editar etiqueta">${ic('edit')}<span class="hide-m">Etiqueta</span></button></div></td></tr>`;}).join('')}</tbody></table></div>`:empty('nfc','Sin tags con este filtro','')}</section>`;
},
revs(){
  const all=DATA.reviews,s=stats(all),by=revF==='good'?r=>r.rating>=4:revF==='mid'?r=>r.rating===3:revF==='bad'?r=>r.rating<=2:()=>true;
  const list=all.filter(by).filter(r=>has(r.msg,r.client,empName(r.emp),bizOfEmp(r.emp)));
  return head('Reseñas',`${all.length} en toda la plataforma · ${s.t?fmt1(s.avg)+'★ promedio':'sin reseñas'}${DEMO}`)+
  segH('revSeg',revF,[['all','Todas',all.length],['good','Buenas',s.g],['mid','Regulares',s.n],['bad','Malas',s.b]])+
  `${list.length?carH('Reseñas',`${list.length} ${list.length===1?'reseña':'reseñas'} · desliza para ver más`,list.slice(0,60).map(r=>`<article class="rv"><div class="rv-top">${starsH(r.rating)}<span class="lbl">${r.rating}★ · ${LABELS[r.rating]}</span><time>${fmtDate(r.date)}</time></div>${r.msg?`<p>“${esc(r.msg)}”</p>`:'<p class="none">Sin comentario</p>'}<div class="rv-by">${esc(r.client)} · Atendido por <b>${esc(empName(r.emp)||'Empleado eliminado')}</b> · ${esc(bizOfEmp(r.emp)||'—')}</div><div class="acts" style="margin-top:8px;justify-content:flex-start"><button class="btn sm" data-edit-rev="${r.id}">${ic('edit')}Editar</button><button class="btn sm ghost del" data-del-rev="${r.id}">${ic('trash')}Eliminar</button></div></article>`).join('')):`<section class="card">${empty('msg','Ninguna reseña con este filtro','')}</section>`}
  ${list.length>60?`<p class="note">Se muestran las 60 más recientes de ${list.length}. Usa el buscador para encontrar una en particular.</p>`:''}`;
},
act(){
  const ev=events(),list=ev.filter(x=>actF==='all'||x.k===actF);
  return head('Actividad','Todo lo que pasa en la plataforma, en orden'+DEMO,'<span class="live">En vivo</span>')+
  segH('actSeg',actF,[['all','Todo',ev.length],['rev','Reseñas',ev.filter(x=>x.k==='rev').length],['tap','Taps',ev.filter(x=>x.k==='tap').length],['pay','Pagos',ev.filter(x=>x.k==='pay').length]])+
  `<section class="card">${feedH(list.slice(0,80))}</section>${list.length>80?`<p class="note">Se muestran los 80 eventos más recientes de ${list.length}.</p>`:''}`;
},
req(){
  const list=DB.requests.filter(r=>reqF==='all'||r.type===reqF);
  return head('Solicitudes','Negocios nuevos y personas que quieren unirse a un equipo'+DEMO)+
  `<div class="tools"><div class="seg" id="reqSeg">${[['all','Todas'],['business','Negocios'],['employee','Empleados']].map(([k,l])=>`<button data-f="${k}" class="${reqF===k?'on':''}">${l} · ${k==='all'?DB.requests.length:DB.requests.filter(r=>r.type===k).length}</button>`).join('')}</div></div>
  <section class="card">${list.length?list.map(reqRow).join(''):empty('check','Todo al día','No hay solicitudes pendientes.')}</section>`;
},
users(){
  return head('Usuarios',`${DB.users.length} cuentas, agrupadas por negocio`,`<button class="btn go" id="newUser">${ic('plus')}Nuevo usuario</button>`)+
  `<div class="tools"><label class="search">${ic('search')}<input id="uq" placeholder="Buscar por nombre o email" value="${esc(userQ)}" aria-label="Buscar usuarios"></label>
   <div class="seg" id="roleSeg">${[['all','Todos'],['admin','Admin'],['business','Dueño'],['employee','Empleado'],['user','Usuario']].map(([v,l])=>`<button data-r="${v}" class="${userRole===v?'on':''}">${l}</button>`).join('')}</div></div>
   <div id="groups"></div>`;
},
biz(){
  if(bizOpen)return bizDetail(biz(bizOpen));
  return head('Negocios',`${DB.businesses.length} ${DB.businesses.length===1?'negocio':'negocios'} con sus equipos`,`<button class="btn go" id="newBiz">${ic('plus')}Nuevo negocio</button>`)+
  `<div id="bizList">${DB.businesses.filter(bq).map(b=>{const o=user(b.ownerId),em=empsOf(b.id),st=statusOf(b.status),rs=stats(reviewsOf(b.id));
    return `<section class="card group ${closed.has(b.id)?'closed':''}" data-g="${b.id}" style="margin-bottom:12px">
    <div class="biz-card" style="cursor:default"><div class="ini biz">${ini(b.name)}</div><div style="flex:1;min-width:0"><b style="font-size:15px">${esc(b.name)}</b> <span class="tag ${st[1]}">${st[0]}</span>
      <div class="meta"><span>Dueño: ${o?esc(o.name):'Sin dueño'}</span><span>${em.length} empleados</span><span>${rs.t} reseñas · ${fmt1(rs.avg)}★</span><span>${DB.tags.filter(t=>t.businessId===b.id).length} tags</span></div></div>
      <button class="btn sm" data-open="${b.id}">Gestionar</button><button class="icon-btn" data-toggle="${b.id}" aria-label="Mostrar empleados" style="border:none">${ic('chev','class="i chev"')}</button></div>
    <div class="group-b">${em.length?em.map(e=>{const u=user(e.userId),es=stats(DATA.reviews.filter(r=>r.emp===e.id));return `<div class="row"><div class="ini">${ini(e.name)}</div><div class="who"><b>${esc(e.name)}${e.active?'':' <span class="tag off">Inactivo</span>'}</b><span>${esc(e.role||'Colaborador')} · ${u?esc(u.email):'sin cuenta'}</span></div><span class="tag">${es.t} val. · ${es.t?fmt1(es.avg):'—'}★</span></div>`}).join(''):'<div class="empty">Sin empleados</div>'}</div></section>`}).join('')}</div>`;
},
pay(){
  const list=DB.payments.filter(p=>(payF==='all'||p.status===payF)&&has(p.business,p.buyer,p.email,p.ref));
  const paid=DB.payments.filter(p=>p.status==='approved').reduce((a,p)=>a+p.amount,0);
  return head('Pagos',`${money(paid)} aprobados en total`+DEMO)+
  `<div class="tools"><div class="seg" id="paySeg">${[['all','Todos'],...Object.entries(PAY).map(([k,v])=>[k,v[0]])].map(([k,l])=>`<button data-f="${k}" class="${payF===k?'on':''}">${l}</button>`).join('')}</div></div>
  <section class="card">${list.length?`<div class="tbl-wrap"><table><thead><tr><th>Negocio</th><th>Producto</th><th>Comprador</th><th>Referencia</th><th>Fecha</th><th class="num">Monto</th><th>Estado</th><th></th></tr></thead><tbody>${list.map(payTr).join('')}</tbody></table></div><div class="pay-cards">${list.map(payRow).join('')}</div>`
  :empty('card','Sin pagos con este estado','')}</section>`;
},
};
function reqRow(r){
  const acts=`<div class="acts"><button class="btn sm" data-rej="${r.id}">Rechazar</button><button class="btn sm go" data-ok="${r.id}">${ic('check')}Aprobar</button></div>`;
  return r.type==='business'
  ?`<div class="row"><div class="ini biz">${ini(r.name)}</div><div class="who"><b>${esc(r.name)} <span class="tag g">Nuevo negocio</span></b><span>${esc([r.category,r.city].filter(Boolean).join(' · '))} · Solicita ${esc(r.by)} · ${esc(r.supporters)} apoyos</span></div>${acts}</div>`
  :`<div class="row"><div class="ini">${ini(r.name)}</div><div class="who"><b>${esc(r.name)} <span class="tag a">Quiere ser empleado</span></b><span>${esc(r.email)} · ${esc(biz(r.businessId)?.name||'—')} · ${esc(r.job)}</span></div>${acts}</div>`;
}
function payRow(p){const s=payOf(p.status);
  return `<div class="row"><div class="who"><b>${esc(p.business)} · ${esc(prodOf(p.product))}${p.qty>1?' ×'+p.qty:''}</b><span>${esc(p.buyer)} · ${esc(p.ref)} · ${p.date.toLocaleDateString('es')}</span></div><div class="acts inline"><b>${money(p.amount)}</b><span class="tag ${s[1]}">${s[0]}</span></div></div>`;}
function payTr(p){const s=payOf(p.status);
  return `<tr><td><b>${esc(p.business)}</b></td><td>${esc(prodOf(p.product))}${p.qty>1?' ×'+p.qty:''}</td><td>${esc(p.buyer)}<br><span style="color:var(--muted);font-size:12px">${esc(p.email)}</span></td><td><code>${esc(p.ref)}</code></td><td>${p.date.toLocaleDateString('es')}</td><td class="num"><b>${money(p.amount)}</b></td><td><span class="tag ${s[1]}">${s[0]}</span></td><td>${p.status==='pending'||p.status==='approved'?`<button class="btn sm ghost del" data-delpay="${p.id}" aria-label="Eliminar pago">${ic('trash')}</button>`:''}</td></tr>`;}

function userGroups(){
  const q=userQ.trim().toLowerCase();
  const isOwner=u=>DB.businesses.some(b=>b.ownerId===u.id);
  const roleOf=u=>u.role==='admin'?'admin':isOwner(u)?'business':u.role;
  const match=u=>(userRole==='all'||u.role===userRole||(userRole==='business'&&isOwner(u)))&&(!q||u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q));
  const groups=[];
  const admins=DB.users.filter(u=>u.role==='admin'&&match(u));
  if(admins.length)groups.push({id:'g-admin',name:'Equipo Toque',sub:'Administradores',ini:'T',rows:admins.map(u=>({u,label:'Admin'}))});
  DB.businesses.forEach(b=>{const rows=[];const o=user(b.ownerId);
    if(o&&match(o))rows.push({u:o,label:'Dueño'});
    empsOf(b.id).forEach(e=>{const u=user(e.userId);if(u&&match(u))rows.push({u,label:e.role||'Empleado'});});
    if(rows.length)groups.push({id:'g-'+b.id,name:b.name,sub:`${rows.length} ${rows.length===1?'persona':'personas'}`,ini:ini(b.name),biz:true,rows});});
  const linked=new Set([...DB.employees.map(e=>e.userId),...DB.businesses.map(b=>b.ownerId)]);
  const free=DB.users.filter(u=>u.role!=='admin'&&!linked.has(u.id)&&match(u));
  if(free.length)groups.push({id:'g-free',name:'Sin negocio',sub:'Clientes y cuentas sin equipo',ini:'—',rows:free.map(u=>({u,label:ROLES[u.role]||u.role}))});
  if(!groups.length)return `<section class="card">${empty('search','Sin resultados','Prueba con otro nombre, email o rol.')}</section>`;
  return groups.map(g=>`<section class="card group ${closed.has(g.id)?'closed':''}" data-g="${g.id}" style="margin-bottom:12px">
    <button class="group-h" aria-expanded="${!closed.has(g.id)}"><div class="ini ${g.biz?'biz':''}">${g.ini}</div><b>${esc(g.name)}</b><small>${g.sub}</small>${ic('chev','class="i chev"')}</button>
    <div class="group-b">${g.rows.map(({u,label})=>`<div class="row"><div class="ini">${ini(u.name)}</div><div class="who"><b>${esc(u.name)}</b><span>${esc(u.email)}</span></div>
      <span class="tag ${label==='Dueño'?'g':''}">${esc(label)}</span><div class="acts"><button class="btn sm" data-edit-user="${u.id}">${ic('edit')}Editar</button><button class="btn sm ghost del" data-del-user="${u.id}" aria-label="Eliminar ${esc(u.name)}">${ic('trash')}</button></div></div>`).join('')}</div></section>`).join('');
}

function bizDetail(b){
  const o=user(b.ownerId),emps=empsOf(b.id),st=statusOf(b.status),rs=stats(reviewsOf(b.id)),tags=DB.tags.filter(t=>t.businessId===b.id);
  const tabs=[['team','Equipo',emps.length],['nfc','Tags NFC',tags.length],['rev','Reseñas',rs.t],['prof','Perfil','']];
  let body='';
  if(bizTab==='team')body=`<section class="card"><div class="card-h">${ic('users')}<h2>Equipo</h2><button class="btn sm go" id="addEmp" style="margin-left:auto">${ic('plus')}Añadir empleado</button></div>
    ${emps.length?emps.map(e=>{const u=user(e.userId),es=stats(DATA.reviews.filter(r=>r.emp===e.id));return `<div class="row"><div class="ini">${ini(e.name)}</div><div class="who"><b>${esc(e.name)}${e.active?'':' <span class="tag off">Inactivo</span>'}</b><span>${esc(e.role||'Colaborador')} · ${u?esc(u.email):'sin cuenta vinculada'} · ${es.t} val. · ${es.pg}% buenas</span></div>
      <div class="acts"><button class="btn sm" data-copy-emp="${e.id}">${ic('nfc')}Link NFC</button><button class="switch ${e.active?'on':''}" data-act="${e.id}" role="switch" aria-checked="${e.active}" aria-label="Activo"></button><button class="btn sm" data-edit-emp="${e.id}">${ic('edit')}Editar</button><button class="btn sm ghost del" data-del-emp="${e.id}" aria-label="Eliminar ${esc(e.name)}">${ic('trash')}</button></div></div>`}).join('')
    :empty('users','Este negocio aún no tiene equipo','')}</section>`;
  if(bizTab==='nfc')body=`<section class="card"><div class="card-h">${ic('nfc')}<h2>Tags NFC</h2></div>${tags.map(t=>{const n=DATA.taps.filter(x=>x.tag===t.id).length;return `<div class="row"><div class="who"><b>${esc(t.label)}${t.active?'':' <span class="tag off">Inactivo</span>'}</b><span>${t.type==='business_google'?'Google del negocio':'Reseña de empleado'} · ${n} lecturas · <code>/nfc/••••${esc(t.id)}</code></span></div><div class="acts"><button class="btn sm" data-copy-tag="${t.id}">${ic('copy')}Copiar</button><button class="switch ${t.active?'on':''}" data-tag="${t.id}" role="switch" aria-checked="${t.active}" aria-label="Tag activo"></button><button class="btn sm" data-edit-tag="${t.id}">${ic('edit')}Etiqueta</button></div></div>`}).join('')}</section>`;
  if(bizTab==='rev')body=`<section class="card">${reviewsOf(b.id).slice(0,12).map(r=>`<article class="rv"><div class="rv-top">${starsH(r.rating)}<span class="lbl">${r.rating}★ · ${LABELS[r.rating]}</span><time>${fmtDate(r.date)}</time></div>${r.msg?`<p>“${esc(r.msg)}”</p>`:'<p class="none">Sin comentario</p>'}<div class="rv-by">${esc(r.client)} · Atendido por <b>${esc(DB.employees.find(e=>e.id===r.emp)?.name||'Empleado eliminado')}</b></div><div class="acts" style="margin-top:8px;justify-content:flex-start"><button class="btn sm" data-edit-rev="${r.id}">${ic('edit')}Editar</button><button class="btn sm ghost del" data-del-rev="${r.id}">${ic('trash')}Eliminar</button></div></article>`).join('')}</section>`;
  if(bizTab==='prof')body=`<section class="card"><form class="form" id="bf">
    <label class="full">Nombre<input name="name" value="${esc(b.name)}"></label>
    <label>Dueño (jefe)<select name="ownerId"><option value="">Sin asignar</option>${DB.users.map(u=>`<option value="${u.id}" ${u.id===b.ownerId?'selected':''}>${esc(u.name)} (${esc(u.email)})</option>`).join('')}</select></label>
    <label>Categoría<select name="category">${[...new Set([...DB.categories,b.category].filter(Boolean))].map(c=>`<option ${c===b.category?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
    <label>Estado<select name="status">${Object.entries(STATUS).map(([k,v])=>`<option value="${k}" ${k===b.status?'selected':''}>${v[0]}</option>`).join('')}</select></label>
    <label class="chk" style="flex-direction:row;align-items:center;gap:8px;color:var(--ink);align-self:end;height:40px"><input type="checkbox" name="featured" ${b.featured?'checked':''} style="height:auto">Destacado</label>
    <label class="full">Dirección<input name="address" value="${esc(b.address)}"></label><label>Ciudad<input name="city" value="${esc(b.city)}"></label><label>Teléfono<input name="phone" value="${esc(b.phone)}"></label>
    <label>Sitio web<input name="website" value="${esc(b.website)}"></label><label>Instagram<input name="instagram" value="${esc(b.instagram)}"></label>
    <label class="full">Link de reseñas de Google<input name="googleReviewUrl" value="${esc(b.googleReviewUrl)}" placeholder="https://g.page/r/…/review"></label>
    <label class="full">Descripción<textarea name="description">${esc(b.description)}</textarea></label>
    <div class="full" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><button type="button" class="btn del" id="delBiz">${ic('trash')}Eliminar negocio</button><button class="btn go">${ic('check')}Guardar cambios</button></div></form></section>`;
  return `<button class="back" id="back">${ic('back')}Negocios</button>
  <section class="card" style="padding:18px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
    <div class="ini biz" style="width:56px;height:56px;font-size:20px;border-radius:14px">${ini(b.name)}</div>
    <div style="flex:1;min-width:200px"><h1 style="font-size:22px">${esc(b.name)} <span class="tag ${st[1]}" style="vertical-align:middle">${st[0]}</span></h1><p style="color:var(--muted);font-size:13px;margin-top:2px">Dueño: ${o?esc(o.name)+' · '+esc(o.email):'sin asignar'}</p></div>
    <div class="stats"><div><b>${emps.length}</b><span>empleados</span></div><div><b>${rs.t}</b><span>reseñas</span></div><div><b>${fmt1(rs.avg)}★</b><span>promedio</span></div><div><b>${tapsOf(b.id).length}</b><span>taps</span></div></div>
    ${b.status==='claim_pending'?`<button class="btn go" id="verify">${ic('check')}Verificar</button>`:''}
  </section>
  <div class="tools"><div class="seg" id="bizTabs">${tabs.map(([k,l,n])=>`<button data-t="${k}" class="${bizTab===k?'on':''}">${l}${n!==''?' · '+n:''}</button>`).join('')}</div></div>
  ${body}`;
}

const wire={
  emps(){segWire('empSeg',v=>empF=v);empWire();},
  tags(){segWire('tagSeg',v=>tagF=v);tagWire();},
  revs(){segWire('revSeg',v=>revF=v);revWire();},
  act(){segWire('actSeg',v=>actF=v);},
  dash(){root.querySelectorAll('[data-to]').forEach(b=>b.onclick=()=>go(b.dataset.to));
    root.querySelectorAll('tr[data-b]').forEach(t=>{const open=()=>go('biz',t.dataset.b);t.onclick=open;t.tabIndex=0;t.setAttribute('role','link');t.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};});reqWire();},
  req(){root.querySelectorAll('#reqSeg button').forEach(b=>b.onclick=()=>{reqF=b.dataset.f;render();});reqWire();},
  pay(){root.querySelectorAll('#paySeg button').forEach(b=>b.onclick=()=>{payF=b.dataset.f;render();});
    root.querySelectorAll('[data-delpay]').forEach(b=>b.onclick=()=>{const p=DB.payments.find(x=>x.id===b.dataset.delpay);
      confirmDel('el pago '+p.ref,()=>commit('deletePayment',{payment:p},()=>{DB.payments=DB.payments.filter(x=>x!==p);},'Pago eliminado'));});},
  users(){
    const draw=()=>{$('#groups').innerHTML=userGroups();
      root.querySelectorAll('.group-h').forEach(h=>h.onclick=()=>{const g=h.parentElement.dataset.g;closed.has(g)?closed.delete(g):closed.add(g);draw();});
      root.querySelectorAll('[data-edit-user]').forEach(b=>b.onclick=()=>userForm(user(b.dataset.editUser)));
      root.querySelectorAll('[data-del-user]').forEach(b=>b.onclick=()=>{const u=user(b.dataset.delUser);
        confirmDel(u.name,()=>commit('deleteUser',{user:u},()=>{DB.users=DB.users.filter(x=>x!==u);DB.employees=DB.employees.filter(e=>e.userId!==u.id);},'Usuario eliminado'));});};
    draw();
    $('#uq').oninput=e=>{userQ=e.target.value;draw();};
    $('#roleSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>{userRole=b.dataset.r;$('#roleSeg').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));draw();});
    $('#newUser').onclick=()=>userForm(null);
  },
  biz(){
    if(!bizOpen){
      root.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>go('biz',b.dataset.open));
      root.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{const g=b.dataset.toggle;closed.has(g)?closed.delete(g):closed.add(g);render();});
      $('#newBiz').onclick=()=>bizForm();return;}
    const b=biz(bizOpen);
    $('#back').onclick=()=>go('biz');
    root.querySelectorAll('#bizTabs button').forEach(x=>x.onclick=()=>{bizTab=x.dataset.t;render();});
    $('#verify')&&($('#verify').onclick=()=>commit('verifyBusiness',{business:b},()=>{b.status='verified';},'Negocio verificado'));
        if(bizTab==='team'){$('#addEmp').onclick=()=>empForm(null,b.id);empWire();}
    if(bizTab==='nfc')tagWire();
    if(bizTab==='rev')revWire();
    if(bizTab==='prof'){
      $('#bf').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData($('#bf')));
        if(!d.name.trim()){toast('El nombre del negocio es obligatorio');return;}
        if(d.googleReviewUrl&&!/^https:\/\//i.test(d.googleReviewUrl.trim())){toast('El link de Google debe empezar con https://');return;}
        const draft={...d,name:d.name.trim(),googleReviewUrl:(d.googleReviewUrl||'').trim(),featured:!!d.featured};
        await commit('saveBusiness',{business:{...b,...draft},isNew:false},res=>{Object.assign(b,draft,res.business);},'Negocio actualizado');};
      $('#delBiz').onclick=()=>confirmDel(b.name,()=>commit('deleteBusiness',{business:b},()=>{
        DB.businesses=DB.businesses.filter(x=>x!==b);DB.employees=DB.employees.filter(x=>x.businessId!==b.id);DB.tags=DB.tags.filter(x=>x.businessId!==b.id);bizOpen=null;},'Negocio eliminado'));}
  },
};
function empWire(){
  root.querySelectorAll('[data-copy-emp]').forEach(x=>x.onclick=()=>copyLink(x));
  root.querySelectorAll('[data-act]').forEach(s=>s.onclick=()=>{const e=DB.employees.find(x=>x.id===s.dataset.act);const next=!e.active;
    commit('toggleEmployee',{employee:e,active:next},()=>{e.active=next;},next?'Empleado activado':'Empleado desactivado');});
  root.querySelectorAll('[data-edit-emp]').forEach(x=>x.onclick=()=>{const e=DB.employees.find(y=>y.id===x.dataset.editEmp);empForm(e,e.businessId);});
  root.querySelectorAll('[data-del-emp]').forEach(x=>x.onclick=()=>{const e=DB.employees.find(y=>y.id===x.dataset.delEmp);
    confirmDel(e.name,()=>commit('deleteEmployee',{employee:e},()=>{DB.employees=DB.employees.filter(y=>y!==e);},'Empleado eliminado'));});
}
function tagWire(){
  root.querySelectorAll('[data-copy-tag]').forEach(x=>x.onclick=()=>copyLink(x));
  root.querySelectorAll('[data-tag]').forEach(s=>s.onclick=()=>{const t=DB.tags.find(x=>x.id===s.dataset.tag);const next=!t.active;
    commit('toggleTag',{tag:t,active:next},()=>{t.active=next;},next?'Tag activado':'Tag desactivado');});
  root.querySelectorAll('[data-edit-tag]').forEach(x=>x.onclick=()=>{const t=DB.tags.find(y=>y.id===x.dataset.editTag);
    form('Editar tag',`<label>Etiqueta<input name="label" value="${esc(t.label)}" required></label>`,d=>{
      const label=(d.label||'').trim();if(!label){toast('La etiqueta no puede estar vacía');return false;}
      return commit('saveTag',{tag:{...t,label}},res=>{Object.assign(t,{label},res.tag);},'Tag actualizado');});});
}
function revWire(){
  root.querySelectorAll('[data-edit-rev]').forEach(x=>x.onclick=()=>{const r=DATA.reviews.find(y=>y.id===x.dataset.editRev);
    form('Editar reseña',`<label>Contenido<input name="msg" value="${esc(r.msg)}"></label><label>Puntuación (1-5)<input name="rating" type="number" min="1" max="5" value="${r.rating}"></label>`,d=>{
      const rating=Math.min(5,Math.max(1,Math.round(+d.rating)||r.rating));
      return commit('saveReview',{review:{...r,msg:d.msg,rating}},res=>{Object.assign(r,{msg:d.msg,rating},res.review);},'Reseña actualizada');});});
  root.querySelectorAll('[data-del-rev]').forEach(x=>x.onclick=()=>{const r=DATA.reviews.find(y=>y.id===x.dataset.delRev);
    confirmDel('esta reseña',()=>commit('deleteReview',{review:r},()=>{DATA.reviews=DATA.reviews.filter(y=>y!==r);},'Reseña eliminada'));});
}
const segWire=(id,set)=>root.querySelectorAll('#'+id+' button').forEach(b=>b.onclick=()=>{set(b.dataset.f);render();});
function reqWire(){
  root.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>{const r=DB.requests.find(x=>x.id===b.dataset.ok);
    if(r.type==='employee'){
      const bn=biz(r.businessId)?.name||'el negocio';
      commit('approveRequest',{request:r},res=>{DB.requests=DB.requests.filter(x=>x!==r);
        DB.employees.push({id:uid('e'),name:r.name,businessId:r.businessId,userId:r.userId,role:r.job,active:true,...res.employee});
        const u=user(r.userId);if(u&&u.role!=='admin')u.role='employee';},`${r.name} se unió a ${bn} con su NFC`);
    }else{
      commit('approveRequest',{request:r},res=>{DB.requests=DB.requests.filter(x=>x!==r);
        const u=DB.users.find(x=>x.email===r.email);
        DB.businesses.push({id:uid('b'),name:r.name,ownerId:u?.id||'',status:'verified',featured:false,category:r.category,city:r.city,address:'',phone:'',website:'',instagram:'',googleReviewUrl:'',hours:'',description:'',...res.business});
        if(u&&u.role!=='admin')u.role='business';},`${r.name} creado con su tag de Google`);
    }});
  root.querySelectorAll('[data-rej]').forEach(b=>b.onclick=()=>{const r=DB.requests.find(x=>x.id===b.dataset.rej);
    commit('rejectRequest',{request:r},()=>{DB.requests=DB.requests.filter(x=>x!==r);},'Solicitud rechazada');});
}
async function copyLink(x){
  const emp=x.dataset.copyEmp?DB.employees.find(e=>e.id===x.dataset.copyEmp):null;
  const tag=x.dataset.copyTag?DB.tags.find(t=>t.id===x.dataset.copyTag):DB.tags.find(t=>t.emp===emp?.id);
  let url=tag?.url||emp?.nfcUrl;
  if(!url&&typeof H().getNfcLink==='function'){try{url=await H().getNfcLink({tag,employee:emp});}catch(err){console.error(err);}}
  if(!url){toast('Este tag aún no tiene link');return;}
  toast(await copyText(url)?'Link copiado':'No se pudo copiar el link');
}

let lastFocus=null;
function closeModal(){const l=$('#layer');if(!l.innerHTML)return;l.innerHTML='';lastFocus&&lastFocus.isConnected&&lastFocus.focus();lastFocus=null;}
function modal(title,body,foot,onOpen){
  lastFocus=root.activeElement||null;
  $('#layer').innerHTML=`<div class="scrim" id="scrim"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2><button class="icon-btn" id="mx" aria-label="Cerrar" style="border:none">${ic('x')}</button></header>${body}${foot}</div></div>`;
  $('#mx').onclick=closeModal;$('#scrim').onclick=e=>{if(e.target.id==='scrim')closeModal();};
  onOpen&&onOpen(closeModal);const f=$('#layer input,#layer select,#layer footer .btn');f&&f.focus();
}
const onKey=e=>{
  const l=$('#layer');if(!l||!l.innerHTML)return;
  if(e.key==='Escape'){e.stopPropagation();closeModal();return;}
  if(e.key==='Tab'){const els=[...l.querySelectorAll('button:not(:disabled),input,select,textarea,[tabindex="0"]')];if(!els.length)return;
    const first=els[0],last=els[els.length-1],act=root.activeElement;
    if(e.shiftKey&&act===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&act===last){e.preventDefault();first.focus();}}
};
root.addEventListener('keydown',onKey);
const sel=(name,opts,v)=>`<select name="${name}">${opts.map(([k,l])=>`<option value="${esc(k)}" ${k===v?'selected':''}>${esc(l)}</option>`).join('')}</select>`;
/* save(datos) debe devolver una promesa<boolean> (commit) o false si la validación falla; el modal se cierra solo si salió bien */
function form(title,fields,save){
  modal(title,`<form id="mf">${fields}</form>`,`<footer><button class="btn" id="mc">Cancelar</button><button class="btn go" id="ms">Guardar</button></footer>`,close=>{
    $('#mc').onclick=close;
    const submit=async e=>{e&&e.preventDefault();if(!$('#mf').reportValidity())return;
      $('#ms').disabled=true;
      const ok=await save(Object.fromEntries(new FormData($('#mf'))));
      if(ok!==false)close();else if($('#ms'))$('#ms').disabled=false;};
    $('#ms').onclick=submit;$('#mf').onsubmit=submit;
    const file=$('#mf input[type="file"]'),fileName=$('#logoFileName');
    if(file&&fileName)file.onchange=()=>{const picked=file.files&&file.files[0];fileName.textContent=picked?picked.name:'Ningún archivo seleccionado';fileName.title=picked?picked.name:'';};});
}
function userForm(u){
  form(u?'Editar usuario':'Nuevo usuario',
    `<label>Nombre<input name="name" required value="${esc(u?.name)}"></label><label>Email<input name="email" type="email" required value="${esc(u?.email)}"></label>${u?'':'<label>Contraseña<input name="password" type="password" required minlength="8" autocomplete="new-password"></label>'}<label>Rol${sel('role',Object.entries(ROLES),u?.role||'user')}</label>`,
    d=>{const draft={name:(d.name||'').trim(),email:(d.email||'').trim(),role:d.role};
      if(!draft.name){toast('El nombre es obligatorio');return false;}
      if(DB.users.some(x=>x!==u&&x.email.toLowerCase()===draft.email.toLowerCase())){toast('Ya existe un usuario con ese email');return false;}
      return commit('saveUser',{user:u?{...u,...draft}:{...draft,password:d.password},isNew:!u},res=>{
        if(u)Object.assign(u,draft,res.user);else DB.users.unshift({id:uid('u'),...draft,...res.user});},u?'Usuario actualizado':'Usuario creado');});
}
function bizForm(){
  form('Nuevo negocio',
    `<label>Nombre del negocio<input name="name" required></label><label>Dueño (jefe)${sel('ownerId',[['','Sin asignar'],...DB.users.map(u=>[u.id,u.name+' ('+u.email+')'])],'')}</label><div class="file-field"><span>Logo del negocio</span><div class="file-box"><span class="file-name" id="logoFileName">Ningún archivo seleccionado</span><label class="file-pick" for="logoFile">${ic('img')}Seleccionar imagen</label><input id="logoFile" name="logo" type="file" accept="image/jpeg,image/png,image/webp"></div><span class="file-help">JPG, PNG o WebP · máximo 2 MB</span></div>`,
    d=>{const name=(d.name||'').trim();if(!name){toast('El nombre del negocio es obligatorio');return false;}
      const logo=d.logo&&d.logo.size?d.logo:null;
      if(logo&&(!/^image\/(jpeg|png|webp)$/.test(logo.type)||logo.size>2*1024*1024)){toast('Usa JPG, PNG o WebP de hasta 2 MB');return false;}
      return commit('saveBusiness',{business:{name,ownerId:d.ownerId},logo,isNew:true},res=>{
        DB.businesses.unshift({id:uid('b'),name,ownerId:d.ownerId,status:'verified',featured:false,category:'',city:'',address:'',phone:'',website:'',instagram:'',googleReviewUrl:'',hours:'',description:'',...res.business});},'Negocio creado con su tag de Google');});
}
function empForm(e,bid){
  form(e?'Editar empleado':'Añadir empleado',
    `<label>Nombre del empleado<input name="name" required value="${esc(e?.name)}"></label>${e?'':`<label>Usuario vinculado${sel('userId',[['','Sin asignar'],...DB.users.map(u=>[u.id,u.name+' ('+u.email+')'])],'')}</label>`}<label>Cargo (ej. Mesero, Cajero)<input name="role" value="${esc(e?.role)}"></label><label class="chk"><input type="checkbox" name="active" ${!e||e.active?'checked':''}>Activo</label>`,
    d=>{const draft={name:(d.name||'').trim(),role:(d.role||'').trim(),active:!!d.active};if(!draft.name){toast('El nombre es obligatorio');return false;}
      return commit('saveEmployee',{employee:e?{...e,...draft}:{...draft,businessId:bid,userId:d.userId},isNew:!e},res=>{
        if(e)Object.assign(e,draft,res.employee);else DB.employees.push({id:uid('e'),businessId:bid,userId:d.userId,...draft,...res.employee});},e?'Empleado actualizado':'Empleado añadido con su NFC');});
}
function confirmDel(name,ok){
  modal('Eliminar',`<p class="q">¿Seguro que quieres eliminar <b>${esc(name)}</b>? Esta acción no se puede deshacer.</p>`,`<footer><button class="btn" id="mc">Cancelar</button><button class="btn del" id="ms">${ic('trash')}Eliminar</button></footer>`,close=>{$('#mc').onclick=close;$('#ms').onclick=()=>{close();ok();};});
}
let tt;function toast(m){root.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.textContent=m;t.setAttribute('role','status');$('.app').appendChild(t);clearTimeout(tt);tt=setTimeout(()=>t.remove(),2400);}
$('#logout').onclick=()=>host.dispatchEvent(new CustomEvent('toque:logout',{bubbles:true,composed:true}));
render();
return{destroy(){dead=true;ro&&ro.disconnect();root.removeEventListener('click',onRootClick);root.removeEventListener('keydown',onRootEsc);clearTimeout(tt);cancelAnimationFrame(raf);root.removeEventListener('keydown',onKey);window.removeEventListener('storage',onStorage);window.removeEventListener('toque:themechange',onSibling);},setTheme:t=>setTheme(t,false),getTheme:()=>theme};
}

export class ToqueAdmin extends HTMLElement {
  static get observedAttributes(){ return ['hide-header','theme']; }
  #app = null; #data = null;
  constructor(){ super(); this.hooks = {}; this.attachShadow({mode:'open'}); }
  get data(){ return this.#data; }
  set data(v){ this.#data = v; if(this.isConnected) this.#mount(); }
  connectedCallback(){ this.#mount(); }
  disconnectedCallback(){ this.#unmount(); }
  attributeChangedCallback(n, _o, v){ if(n === 'theme'){ this.#app?.setTheme(v); return; } if(this.isConnected) this.#mount(); }
  get theme(){ return this.#app ? this.#app.getTheme() : null; }
  set theme(v){ this.#app?.setTheme(v); }
  #unmount(){ this.#app?.destroy(); this.#app = null; this.shadowRoot.innerHTML = ''; }
  #mount(){ this.#unmount(); if(!this.#data) return; this.#app = boot(this, this.shadowRoot, {data: this.#data}); }
}
if(!customElements.get('toque-admin')) customElements.define('toque-admin', ToqueAdmin);
