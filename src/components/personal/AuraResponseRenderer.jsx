import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { personal } from "./PersonalUI";

const INTERNAL = /^(?:user-query|derived:[\w.-]+|document(?:-chunk)?:[\w.-]+|memory:[\w.-]+)$/i;
function safeResponseText(value = "") {
  return String(value).replace(/<(script|iframe|object|embed|style)[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<\/?(?:html|body|div|span|p|a|img|svg|form|input|button|video|audio|source|table|tr|td|th|ul|ol|li|h[1-6]|br|hr)\b[^>]*>/gi, "").replace(/\[([^\]]+)\]/g, (marker, contents) => {
    const ids = contents.split(",").map((item) => item.trim()).filter(Boolean);
    return ids.length && ids.every((item) => INTERNAL.test(item)) ? "" : marker;
  }).trim();
}

function Citation({ id, sources }) {
  const source = sources.find((item) => { if(String(item.id)!==id)return false;try{return new URL(item.url).protocol==="https:";}catch{return false;} });
  if (!source) return <span>[{id}]</span>;
  return <a href={`#aura-source-${id}`} aria-label={`Source ${id}: ${source.title}`} className={`mx-0.5 inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-blue-300/20 bg-blue-300/10 px-1.5 align-baseline text-xs font-semibold text-blue-200 hover:bg-blue-300/20 ${personal.focus}`}>{id}</a>;
}

function Inline({ text, sources }) {
  const parts=[]; const pattern=/(\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*|\[(\d+)\])/g; let start=0; let match;
  while((match=pattern.exec(text))){if(match.index>start)parts.push(text.slice(start,match.index));const token=match[0];const key=`${match.index}-${token}`;if(match[2])parts.push(<Citation key={key} id={match[2]} sources={sources}/>);else if(token.startsWith("**"))parts.push(<strong key={key} className="font-semibold text-slate-100">{token.slice(2,-2)}</strong>);else if(token.startsWith("`"))parts.push(<code key={key} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[.92em] text-blue-100">{token.slice(1,-1)}</code>);else parts.push(<em key={key}>{token.slice(1,-1)}</em>);start=pattern.lastIndex;}if(start<text.length)parts.push(text.slice(start));return parts;
}

function CodeBlock({ code, language }) {
  const [copied,setCopied]=useState(false); async function copy(){try{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1200);}catch{/* Clipboard may be unavailable in restricted contexts. */}}
  return <div className="my-5 min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/35"><div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-slate-500"><span>{language || "Code"}</span><button type="button" onClick={copy} aria-label="Copy code" className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-slate-300 hover:bg-white/10 ${personal.focus}`}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?"Copied":"Copy"}</button></div><pre className="max-w-full overflow-x-auto p-4 text-sm leading-6 text-slate-200"><code>{code}</code></pre></div>;
}

function CopyResponse({ content }) {
  const [copied,setCopied]=useState(false); async function copy(){try{await navigator.clipboard.writeText(safeResponseText(content));setCopied(true);setTimeout(()=>setCopied(false),1200);}catch{/* Clipboard may be unavailable. */}}
  return <button type="button" onClick={copy} aria-label="Copy response" className={`mb-1 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-300 hover:bg-white/5 ${personal.focus}`}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Copied":"Copy"}</button>;
}

function parseBlocks(content) {
  const lines=safeResponseText(content).replace(/\r\n/g,"\n").split("\n"); const blocks=[]; let index=0;
  while(index<lines.length){const line=lines[index];if(!line.trim()){index+=1;continue;}const fence=line.match(/^```([^`]*)$/);if(fence){const code=[];index+=1;while(index<lines.length&&!/^```/.test(lines[index]))code.push(lines[index++]);if(index<lines.length)index+=1;blocks.push({type:"code",language:fence[1].trim(),text:code.join("\n")});continue;}const heading=line.match(/^(#{1,4})\s+(.+)$/);if(heading){blocks.push({type:"heading",level:heading[1].length,text:heading[2]});index+=1;continue;}const timed=line.match(/^\s*(\d{1,2}:\d{2}\s*[–—-]\s*\d{1,2}:\d{2})\s*(.*)$/);if(timed){let task=timed[2].trim();index+=1;if(!task&&index<lines.length&&lines[index].trim())task=lines[index++].trim();blocks.push({type:"schedule",time:timed[1],text:task});continue;}if(/^>\s?/.test(line)){const quote=[];while(index<lines.length&&/^>\s?/.test(lines[index]))quote.push(lines[index++].replace(/^>\s?/,""));blocks.push({type:"quote",text:quote.join(" ")});continue;}const ordered=/^\s*\d+[.)]\s+(.+)$/.exec(line);const bullet=/^\s*[-*•]\s+(.+)$/.exec(line);if(ordered||bullet){const type=ordered?"ordered":"list",items=[];const matcher=ordered?/^\s*\d+[.)]\s+(.+)$/:/^\s*[-*•]\s+(.+)$/;while(index<lines.length){const item=matcher.exec(lines[index]);if(!item)break;items.push(item[1]);index+=1;}blocks.push({type,items});continue;}const paragraph=[line.trim()];index+=1;while(index<lines.length&&lines[index].trim()&&!/^(?:#{1,4}\s+|```|>\s?|\s*\d+[.)]\s+|\s*[-*•]\s+|\s*\d{1,2}:\d{2}\s*[–—-])/.test(lines[index]))paragraph.push(lines[index++].trim());blocks.push({type:"paragraph",text:paragraph.join(" ")});}
  return blocks;
}

export default function AuraResponseRenderer({ content, mode, sources = [] }) {
  const blocks=parseBlocks(content); const isCurrent=mode==="CURRENT_COMPLETE"; const writing=/^Subject:\s*.+/m.test(content); const currentList=isCurrent?"rounded-2xl border border-white/[.08] bg-white/[.025] p-4 sm:p-5":"";
  return <div className="mt-3 max-w-[74ch] space-y-4 text-[1.04rem] leading-8 text-slate-200">{writing&&<div className="flex justify-end"><CopyResponse content={content}/></div>}{blocks.map((block,index)=>{const key=`${block.type}-${index}`;if(block.type==="code")return <CodeBlock key={key} code={block.text} language={block.language}/>;if(block.type==="schedule")return <div key={key} className="grid gap-1 border-l-2 border-blue-300/30 py-1 pl-4 sm:grid-cols-[8rem_1fr] sm:gap-4"><time className="font-semibold text-blue-200">{block.time}</time><span><Inline text={block.text} sources={sources}/></span></div>;if(block.type==="heading"){const Tag=block.level<=2?"h3":"h4";return <Tag key={key} className={`${block.level<=2?"pt-3 text-xl sm:text-2xl":"pt-2 text-lg"} font-semibold leading-tight text-white`}><Inline text={block.text} sources={sources}/></Tag>;}if(block.type==="quote")return <blockquote key={key} className="border-l-2 border-blue-300/40 pl-4 italic text-slate-300"><Inline text={block.text} sources={sources}/></blockquote>;if(block.type==="ordered"){return <ol key={key} className={`space-y-3 ${isCurrent?"list-none":"list-decimal pl-6"}`}>{block.items.map((item,itemIndex)=><li key={`${item}-${itemIndex}`} className={currentList}>{isCurrent&&<span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-emerald-300">Story {itemIndex+1}</span>}<Inline text={item} sources={sources}/></li>)}</ol>;}if(block.type==="list")return <ul key={key} className="space-y-2 pl-1">{block.items.map((item,itemIndex)=><li key={`${item}-${itemIndex}`} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300"/><span><Inline text={item} sources={sources}/></span></li>)}</ul>;return <p key={key}><Inline text={block.text} sources={sources}/></p>;})}</div>;
}
