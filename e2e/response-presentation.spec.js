import { expect, test } from "@playwright/test";

const personal={user:{id:2,email:"person@aura.local",full_name:"Personal User"},organization:{id:2,name:"Personal Space",account_type:"personal"},workspace:{id:2,name:"My Workspace"},product_mode:"personal",capabilities:["home","personal_home","ask_aura","decisions","documents"]};
async function auth(page){await page.addInitScript(()=>{localStorage.setItem("aura_token","presentation-test");localStorage.removeItem("aura_personal_conversation_id");});await page.route("**/auth/me",r=>r.fulfill({contentType:"application/json",body:JSON.stringify(personal)}));await page.route("**/organizations",r=>r.fulfill({contentType:"application/json",body:JSON.stringify({organizations:[personal.organization]})}));}
const turn=(content,mode="GENERAL",payload)=>({role:"assistant",content,mode,...(payload?{payload}:{})});
async function answer(page,{content,mode="GENERAL",payload}){await page.route("**/personal/ask",r=>r.fulfill({contentType:"application/json",body:JSON.stringify({mode,session_id:101,message:content,turns:[{role:"user",content:"Test request",mode:"USER"},turn(content,mode,payload)]})}));await page.goto("/intelligence");await page.getByLabel("Message Aura").fill("Test request");await page.getByRole("button",{name:"Send"}).click();}

test("general, explanation, writing, planning, and document responses use readable semantic presentation",async({page})=>{
  await auth(page);
  await answer(page,{content:"## Compound interest\n\nCompound interest earns returns on your principal and prior interest.\n\n- Your balance grows\n- Later returns build on earlier returns"});await expect(page.getByRole("heading",{name:"Compound interest"})).toBeVisible();await expect(page.locator("li")).toHaveCount(2);
  await page.unroute("**/personal/ask");await answer(page,{content:"Subject: Request for Friday Afternoon Off\n\nHi <Manager's Name>,\n\nCould I take Friday afternoon off?\n\nBest,\n[Your Name]"});await expect(page.getByRole("button",{name:"Copy response"})).toBeVisible();await expect(page.getByText("Hi <Manager's Name>,",{exact:true})).toBeVisible();
  await page.unroute("**/personal/ask");await answer(page,{content:"## Tonight\n\n6:00–7:30\nStudy for the test\n\n7:30–8:00\nClean the room\n\n8:00–8:40\nPrepare lunch"});await expect(page.getByText("6:00–7:30")).toBeVisible();await expect(page.getByText("Study for the test")).toBeVisible();
  await page.unroute("**/personal/ask");await answer(page,{content:"The policy says requests need approval [Policy].",payload:{}});await expect(page.getByText("The policy says requests need approval [Policy].")).toBeVisible();
});

test("synthetic live Current brief renders hierarchy, mapped citations, and six source cards",async({page})=>{
  await auth(page);const sources=Array.from({length:6},(_,index)=>({id:String(index+1),title:`Verified source ${index+1} with a title that wraps naturally on small screens`,url:`https://source${index+1}.example/story`,domain:`source${index+1}.example`,published_at:"2026-08-17T10:00:00Z",retrieved_at:"2026-08-17T10:05:00Z"}));const content="## Today\n\nSeveral political and economic developments are moving together.\n\n1. **Regional tensions intensify** [1][3]\n2. **Energy markets respond** [2][4]\n3. **Policy makers signal caution** [5][6]\n\n### Overall pattern\n\nThe supplied reporting points to uncertainty across policy and markets.";
  await answer(page,{content,mode:"CURRENT_COMPLETE",payload:{sources}});await expect(page.getByRole("heading",{name:"Today"})).toBeVisible();await expect(page.getByText("Story 1")).toBeVisible();await expect(page.getByText("Story 3")).toBeVisible();await expect(page.getByText("**Regional tensions intensify**")).toHaveCount(0);await expect(page.getByRole("link",{name:/Source 1:/})).toHaveAttribute("href","#aura-source-1");await expect(page.locator('a[href^="https://source"]')).toHaveCount(6);await expect(page.locator("body")).not.toContainText("provider_response_time");
  for(const viewport of [{width:390,height:844},{width:430,height:932},{width:768,height:1024},{width:1024,height:768},{width:1366,height:768},{width:1920,height:1080}]){await page.setViewportSize(viewport);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);await expect(page.getByLabel("Message Aura")).toBeVisible();}
});

test("single-fact Current answer stays concise",async({page})=>{
  await auth(page);const sources=[{id:"1",title:"Rate announcement",url:"https://bank.example/rate",domain:"bank.example",retrieved_at:"2026-08-17T10:05:00Z"}];await answer(page,{content:"The policy rate remains 2.5%. [1]",mode:"CURRENT_COMPLETE",payload:{sources}});await expect(page.getByText("Story 1")).toHaveCount(0);await expect(page.getByRole("link",{name:/Source 1:/})).toBeVisible();
});

test("code is inert and internally scrollable while hostile HTML and links cannot execute",async({page})=>{
  await auth(page);const content="## Safe example\n\n```js\nconst total = 1;\n  console.log(total);\n```\n\n<script>window.presentationPwned = true</script>\n[Unsafe](javascript:alert(1))\n<img src=x onerror=\"window.presentationPwned=true\">";await answer(page,{content});await expect(page.getByRole("button",{name:"Copy code"})).toBeVisible();await expect(page.locator("pre")).toContainText("  console.log(total);");await expect(page.getByRole("link",{name:"Unsafe"})).toHaveCount(0);expect(await page.evaluate(()=>window.presentationPwned)).toBeUndefined();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth)).toBe(true);
});

test("reopened historical messages are formatted at render time without mutation",async({page})=>{
  await auth(page);await page.addInitScript(()=>localStorage.setItem("aura_personal_conversation_id","77"));await page.route("**/personal/ask/77",r=>r.fulfill({contentType:"application/json",body:JSON.stringify({session_id:77,mode:"CONVERSATION",turns:[{role:"user",content:"Explain it",mode:"USER"},turn("## Saved explanation\n\n- First point\n- Second point")]})}));await page.goto("/intelligence");await expect(page.getByRole("heading",{name:"Saved explanation"})).toBeVisible();await expect(page.locator("li")).toHaveCount(2);
});
