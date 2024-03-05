import { StackContext, StaticSite } from "sst/constructs";

export function Stack({ stack }: StackContext) {
  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    customDomain: stack.stage === 'prod' ? {
      domainName: 'macronoupasmacron.fr',
      domainAlias: `www.macronoupasmacron.fr`,
    } : undefined,
  });

  stack.addOutputs({
    "Web URL": web.customDomainUrl || web.url,
  });
}
