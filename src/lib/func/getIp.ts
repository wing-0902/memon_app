interface IpAddressBundle {
  ipv4: string;
  ipv6: string;
}

export class IpService {
  private readonly ipv4Url = 'https://api.ipify.org?format=json';
  private readonly ipv6Url = 'https://api64.ipify.org?format=json'; // IPv6 (またはv4混在) 用

  async fetchAllIps(): Promise<IpAddressBundle> {
    try {
      const [v4Response, v6Response] = await Promise.all([
        fetch(this.ipv4Url),
        fetch(this.ipv6Url)
      ]);

      if (!v4Response.ok) {
        throw new Error(
          `Failed to fetch IPv4 address: ${v4Response.status} ${v4Response.statusText}`
        );
      }
      if (!v6Response.ok) {
        throw new Error(
          `Failed to fetch IPv6 address: ${v6Response.status} ${v6Response.statusText}`
        );
      }

      const v4Data = await v4Response.json();
      const v6Data = await v6Response.json();

      return {
        ipv4: v4Data.ip,
        ipv6: v6Data.ip
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('IP取得に失敗しました:', message);
      return { ipv4: '0.0.0.0', ipv6: '::1' };
    }
  }
}
