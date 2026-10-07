// prepublishOnly is never run by npm pack. Explicit npmjs routing is rejected.
const registry=process.env.npm_config_registry;
if(!registry || new URL(registry).hostname!=='npm.pkg.github.com'){
 console.error('Publication blocked: effective npm registry must explicitly be https://npm.pkg.github.com. Release approval remains separate.');
 process.exit(1);
}
console.log('Effective GitHub Packages registry verified; release approval is still required.');
