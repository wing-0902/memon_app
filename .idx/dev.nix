{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
    pkgs.pnpm
  ];
  idx = {
    extensions = [
      "svelte.svelte-vscode"
      "vue.volar"
    ];
    workspace = {
      onCreate = {
        pnpm-install = "pnpm install";
      };
      onStart = {
        pnpm-install = "pnpm install";
      };
    };
    previews = {
      previews = {
        web = {
          command = [
            "pnpm"
            "dev"
            "--"
            "--port"
            "$PORT"
            "--host"
            "0.0.0.0"
          ];
          manager = "web";
        };
      };
    };
  };
}