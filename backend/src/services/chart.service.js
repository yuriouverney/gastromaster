const OrderStatus = require('../models/enums/order-status.enum');
const OrderItem = require('../models/order-item.model');
const Order = require('../models/order.model');
const Product = require('../models/product.model');

class ChartService {
  async getProductsSoldPerMonth() {
    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['name'],
        },
        {
          model: Order,
          where: { status: OrderStatus.PAID },
        },
      ],
    });

    // Array de nomes de meses
    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    // Agrupar os resultados por produto
    const groupedData = orderItems.reduce((result, item) => {
      const productName = item.product.name;

      if (!result[productName]) {
        result[productName] = {
          label: productName,
          data: {},
        };
      }

      const monthKey = monthNames[item.createdAt.getMonth()]; // Obter o nome do mês
      if (!result[productName].data[monthKey]) {
        result[productName].data[monthKey] = 0;
      }

      result[productName].data[monthKey] += 1; // Você pode ajustar isso dependendo do que representa "quantitySold" para você

      return result;
    }, {});

    // Converter o objeto agrupado de volta para o formato desejado para o gráfico
    const labels = Object.keys(groupedData);
    const datasets = Object.keys(groupedData[labels[0]].data).map((monthKey) => ({
      data: labels.map((productName) => groupedData[productName].data[monthKey] || 0),
      label: monthKey,
    }));

    const chartData = {
      labels,
      datasets,
    };

    console.log(chartData);
    return chartData;
  }
}

module.exports = new ChartService();
