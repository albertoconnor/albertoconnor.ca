import{E as e,Q as t,S as n,_ as r,_t as i,v as a,x as o,yt as s,z as c}from"./modules/shiki-BFOesOFp.js";import{n as l,t as u}from"./slidev/context-Dv0rbSJj.js";import{t as d}from"./slidev/CodeBlockWrapper-B51gdm39.js";import{t as f}from"./slidev/default-CtdSM1PA.js";var p={__name:`slides.md__slidev_7`,setup(p){let{$slidev:m,$nav:h,$clicksContext:g,$clicks:_,$page:v,$renderContext:y,$frontmatter:b}=l();return g.setup(),(l,p)=>{let m=d;return c(),a(f,s(e(i(u)(i(b),6))),{default:t(()=>[p[1]||=r(`h1`,null,`How the Files Relate`,-1),n(m,{title:``,ranges:[]},{default:t(()=>[...p[0]||=[r(`pre`,{class:`shiki shiki-themes vitesse-dark vitesse-light slidev-code`,style:{"--shiki-dark":`#dbd7caee`,"--shiki-light":`#393a34`,"--shiki-dark-bg":`#121212`,"--shiki-light-bg":`#ffffff`}},[r(`code`,{class:`language-text`},[r(`span`,{class:`line`},[r(`span`,null,`                  api.py                          ← HTTP layer`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`                     │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`                     ▼`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`                handlers.py                       ← imperative shell (does IO)`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`                     │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       ┌─────────────┼─────────────┐`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       ▼             ▼             ▼`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`     reads         services      writes`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`     (IO)         (pure)         (IO)`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       │             │             │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       │             ▼             │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       │        structs.py         │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       │   (shared dataclasses)    │`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`       ▼                           ▼`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`                 models.py`)]),o(`
`),r(`span`,{class:`line`},[r(`span`,null,`               (Django ORM)`)])])],-1)]]),_:1}),p[2]||=r(`div`,{class:`mt-4 text-xs opacity-75`},[o(` The `),r(`b`,null,`handler`),o(` sits at the top of the call stack and does all the IO. Below it: data in/out goes through `),r(`code`,null,`reads`),o(` and `),r(`code`,null,`writes`),o(`; pure logic lives in `),r(`code`,null,`services`),o(`. `),r(`b`,null,[r(`code`,null,`structs.py`),o(` is the leaf`)]),o(` — every other file imports from it, it imports from nobody. That's how you avoid circular imports. `)],-1)]),_:1},16)}}};export{p as default};