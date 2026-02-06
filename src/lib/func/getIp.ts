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
        fetch(this.ipv4Url, {
          headers: {
            'X-Bypass-Service-Worker': 'true'
          }
        }),
        fetch(this.ipv6Url, {
          headers: {
            'X-Bypass-Service-Worker': 'true'
          }
        })
      ]);

      const v4Data = await v4Response.json();
      const v6Data = await v6Response.json();

      return {
        ipv4: v4Data.ip,
        ipv6: v6Data.ip
      };
    } catch (error) {
      console.error('IP取得に失敗しました:', error);
      return { ipv4: '0.0.0.0', ipv6: '::1' };
    }
  }
}
