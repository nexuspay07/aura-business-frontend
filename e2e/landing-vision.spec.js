import { expect, test } from "@playwright/test";

test("landing presents Personal now and broader Aura capabilities with truthful status",async({page})=>{
  await page.goto("/");
  await expect(page.getByText("Aura OS",{exact:true})).toHaveCount(0);
  await expect(page.getByText("Alpha — Available now",{exact:true})).toBeVisible();
  await expect(page.getByText("Limited / not publicly activated",{exact:true})).toBeVisible();
  await expect(page.getByText("Future / controlled access",{exact:true})).toBeVisible();
  for(const heading of ["Organizations","Workspaces","Decision Center","Simulation Center","Marketplace","Billing","Current Intelligence","Aura Models","Aura Developer Platform","Aura Research"]){
    await expect(page.getByRole("heading",{name:heading,exact:true}).last()).toBeVisible();
  }
  await expect(page.getByText("Preserved / not activated for Personal Alpha",{exact:true})).toBeVisible();
  await expect(page.getByText("Preserved / inactive for Personal Alpha",{exact:true})).toHaveCount(2);
  await expect(page.getByText(/currently owns a foundation model/i)).toHaveCount(0);
  await expect(page.getByText(/live news retrieval is available/i)).toHaveCount(0);
});

test("landing fluid layout fills common screens without overflow, overlap, or clipped cards",async({page})=>{
  const viewports=[
    {width:390,height:844,personalColumns:1,platformColumns:1},
    {width:430,height:932,personalColumns:1,platformColumns:1},
    {width:768,height:1024,personalColumns:2,platformColumns:2},
    {width:1024,height:768,personalColumns:2,platformColumns:2},
    {width:1280,height:720,personalColumns:3,platformColumns:3},
    {width:1366,height:768,personalColumns:3,platformColumns:3},
    {width:1440,height:900,personalColumns:3,platformColumns:3},
    {width:1536,height:864,personalColumns:3,platformColumns:3},
    {width:1920,height:1080,personalColumns:4,platformColumns:3},
    {width:2560,height:1440,personalColumns:6,platformColumns:3},
  ];
  await page.goto("/");
  for(const viewport of viewports){
    await page.setViewportSize(viewport);
    await expect(page.getByRole("navigation",{name:"Public navigation"})).toBeVisible();
    await expect(page.getByRole("link",{name:"Try Aura"}).first()).toBeVisible();
    await expect(page.getByLabel("Personal Aura conversation demonstration")).toBeVisible();
    await expect(page.getByRole("heading",{name:"One place to think things through."})).toBeVisible();
    const layout=await page.evaluate(()=>{
      const columns=(id)=>getComputedStyle(document.querySelector('[data-testid="'+id+'"]')).gridTemplateColumns.split(" ").length;
      const visibleElements=[...document.querySelectorAll("nav, main > section, main > footer, article, [aria-label='Personal Aura conversation demonstration']")].filter(element=>{const style=getComputedStyle(element);const box=element.getBoundingClientRect();return style.display!=="none"&&box.width>0&&box.height>0;});
      return {
        overflow:document.documentElement.scrollWidth>window.innerWidth||document.body.scrollWidth>window.innerWidth,
        outside:visibleElements.some(element=>{const box=element.getBoundingClientRect();return box.left < -1||box.right > window.innerWidth+1;}),
        personal:columns("personal-capability-grid"),
        platform:columns("platform-grid"),
        heroMinHeight:parseFloat(getComputedStyle(document.querySelector('[data-testid="landing-hero"]')).minHeight)||0,
        heroTrailingSpace:(()=>{const hero=document.querySelector('[data-testid="landing-hero"]').getBoundingClientRect();const copy=document.querySelector('[data-testid="hero-copy"]').getBoundingClientRect();const demo=document.querySelector('[aria-label="Personal Aura conversation demonstration"]').getBoundingClientRect();return hero.bottom-Math.max(copy.bottom,demo.bottom);})(),
        personalTop:document.querySelector("#personal").getBoundingClientRect().top,
        widthRatios:{nav:document.querySelector("nav").getBoundingClientRect().width/window.innerWidth,hero:document.querySelector('[data-testid="landing-hero"]').getBoundingClientRect().width/window.innerWidth,personal:document.querySelector('[data-testid="personal-capability-grid"]').getBoundingClientRect().width/window.innerWidth},
      };
    });
    expect(layout.overflow).toBeFalsy();
    expect(layout.outside).toBeFalsy();
    expect(layout.personal, JSON.stringify(viewport)).toBe(viewport.personalColumns);
    expect(layout.platform).toBe(viewport.platformColumns);
    expect(layout.heroMinHeight).toBe(0);
    expect(layout.heroTrailingSpace).toBeLessThanOrEqual(97);
    if(viewport.width>=1366)expect(layout.personalTop).toBeLessThanOrEqual(viewport.height);
    if(viewport.width>=1366)for(const ratio of Object.values(layout.widthRatios))expect(ratio).toBeGreaterThanOrEqual(.85);
  }
  await expect(page.getByText("Limited / not publicly activated",{exact:true})).toBeVisible();
  await expect(page.getByText("Future / controlled access",{exact:true})).toBeVisible();
});
