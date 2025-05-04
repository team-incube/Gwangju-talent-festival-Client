export interface SchoolInfoResponse {
  schoolInfo: [
    {
      head: [
        {
          list_total_count: number;
        },
        {
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
        }
      ];
    },
    {
      row: SchoolInfo[];
    }
  ];
}

export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  ENG_SCHUL_NM: string;
  SCHUL_KND_SC_NM: string;
  LCTN_SC_NM: string;
  JU_ORG_NM: string;
  FOND_SC_NM: string;
  ORG_RDNZC: string;
  ORG_RDNMA: string;
  ORG_RDNDA: string;
  ORG_TELNO: string;
  HMPG_ADRES: string;
  COEDU_SC_NM: string;
  ORG_FAXNO: string;
  HS_SC_NM: string;
  INDST_SPECL_CCCCL_EXST_YN: string;
  HS_GNRL_BUSNS_SC_NM: string;
  SPCLY_PURPS_HS_ORD_NM: string | null;
  ENE_BFE_SEHF_SC_NM: string;
  DGHT_SC_NM: string;
  FOND_YMD: string;
  FOAS_MEMRD: string;
  LOAD_DTM: string;
}
