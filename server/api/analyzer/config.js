exports.CONST = function() {
  const analyzer_connect_by_com_by_tcpip = [
    {
      name: 'SysmexCa500',
      connecting: true
    },

    {
      name: 'AU400',
      connecting: true
    },

    {
      name: 'ProlyteDiaMond',
      connecting: true
    },

    {
      name: 'ABXPentraES60',
      connecting: true
    },

    {
      name: 'CompilyzerHuman',
      connecting: true
    },

    {
      name: 'OPTILION',
      connecting: true
    },
    
    {
      name: 'Phoenix100',
      connecting: true
    },
    
    {
      name: 'Sysmex-KX21',
      connecting: true
    }
  ];

  const time_minutes = 2; // Updating analyzers every 02 minutes.

  return {
    time_minutes: time_minutes,
    analyzer: analyzer_connect_by_com_by_tcpip
  };
};
