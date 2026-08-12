import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { INotificacao } from '../interfaces/INotificacao.js';
import { Response } from 'express';

class RelatorioService {
  async gerarExcel(notificacoes: INotificacao[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Notificações');

    // Define as colunas e larguras da planilha
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 8 },
      { header: 'Paciente', key: 'nome_paciente', width: 30 },
      { header: 'Mãe', key: 'nome_mae', width: 30 },
      { header: 'Localidade', key: 'localidade', width: 20 },
      { header: '1ºs Sintomas', key: 'dt_primeiros_sintomas', width: 15 },
      { header: 'Notificação', key: 'dt_notificacao', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Resultado', key: 'resultado', width: 15 },
      { header: 'Arboviroses', key: 'arboviroses', width: 25 }
    ];

    // Estiliza o cabeçalho (Negrito e Fundo Azul)
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' }
    };

    // Adiciona os dados
    notificacoes.forEach((item) => {
      const arboviroses = [
        item.dengue ? 'Dengue' : null,
        item.chikungunya ? 'Chikungunya' : null,
        item.zika ? 'Zika' : null
      ].filter(Boolean).join(', ');

      worksheet.addRow({
        id: item.id,
        nome_paciente: item.nome_paciente,
        nome_mae: item.nome_mae,
        localidade: item.localidade,
        dt_primeiros_sintomas: item.dt_primeiros_sintomas,
        dt_notificacao: item.dt_notificacao,
        status: item.status,
        resultado: item.resultado || 'Pendente',
        arboviroses
      });
    });

    // Configura os cabeçalhos HTTP para download do arquivo
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio_notificacoes.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  gerarPDF(notificacoes: INotificacao[], res: Response): void {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=relatorio_notificacoes.pdf'
    );

    doc.pipe(res);

    // Título do Documento
    doc.fontSize(18).text('Relatório de Notificações de Arboviroses', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.moveDown(1.5);

    // Lista de Notificações
    notificacoes.forEach((item, index) => {
      doc.fontSize(12).fillColor('#1E3A8A').text(`${index + 1}. ${item.nome_paciente}`);
      doc.fontSize(10).fillColor('#000000');
      doc.text(`   Mãe: ${item.nome_mae} | Localidade: ${item.localidade}`);
      doc.text(`   1ºs Sintomas: ${item.dt_primeiros_sintomas} | Status: ${item.status}`);
      doc.text(`   Resultado: ${item.resultado || 'Pendente'}`);
      doc.moveDown(0.8);
    });

    doc.end();
  }
}

export default new RelatorioService();