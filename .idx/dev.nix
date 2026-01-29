{pkgs}: {
  channel = "stable-24.11";
  packages = [
    pkgs.nodejs_22
    pkgs.pnpm
  ];
  idx = {
    extensions = [
      "svelte.svelte-vscode"
      "sdras.night-owl"
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
            "run"
            "dev"
            "--host"
            "0.0.0.0"
            "--port"
            "$PORT"
          ];
          manager = "web";
          env = {
            PORT = "5173"; 
          };
        };
      };
    };
  };
}