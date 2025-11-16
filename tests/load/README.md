# Tests de Carga con Locust

Este directorio contiene la configuración y documentación para ejecutar tests de carga usando Locust.

## Requisitos Previos

1. **Python 3.8+** instalado
2. Instalar dependencias de Python:
   ```bash
   pip install -r requirements.txt
   ```

## Configuración

1. Asegúrate de tener un archivo `.env` en la raíz del proyecto con:
   ```env
   API_URL=https://workflow-energy.onrender.com/api
   ADMIN_USER=tu_email@example.com
   ADMIN_PASS=tu_password
   BASE_URL=https://workflow-energy.vercel.app
   ```

## Ejecución

### Modo Interactivo (con interfaz web)

```bash
# Desde la raíz del proyecto
npm run load:test
```

O directamente:
```bash
locust -f tests/load/locustfile.py --host=https://workflow-energy.vercel.app
```

Luego abre tu navegador en: `http://localhost:8089`

### Modo Headless (sin interfaz web)

```bash
# Ejecutar con 10 usuarios, tasa de crecimiento 2, durante 5 minutos
npm run load:test:headless
```

O con parámetros personalizados:
```bash
locust -f tests/load/locustfile.py \
  --host=https://workflow-energy.vercel.app \
  --users 10 \
  --spawn-rate 2 \
  --run-time 5m \
  --headless \
  --html=reports/locust-report.html
```

### Usando scripts de npm

```bash
# Ejecutar test de carga básico (modo interactivo)
npm run load:test

# Ejecutar en modo headless con reporte HTML
npm run load:test:headless

# Ejecutar solo usuarios no autenticados
npm run load:test:unauthenticated
```

## Escenarios de Carga

### Escenario 1: Carga Normal
```bash
locust -f tests/load/locustfile.py \
  --host=https://workflow-energy.vercel.app \
  --users 10 \
  --spawn-rate 2 \
  --run-time 5m \
  --headless \
  --html=reports/locust-report-normal.html
```

### Escenario 2: Carga Media
```bash
locust -f tests/load/locustfile.py \
  --host=https://workflow-energy.vercel.app \
  --users 50 \
  --spawn-rate 5 \
  --run-time 10m \
  --headless \
  --html=reports/locust-report-medium.html
```

### Escenario 3: Carga Alta
```bash
locust -f tests/load/locustfile.py \
  --host=https://workflow-energy.vercel.app \
  --users 100 \
  --spawn-rate 10 \
  --run-time 15m \
  --headless \
  --html=reports/locust-report-high.html
```

### Escenario 4: Stress Test
```bash
locust -f tests/load/locustfile.py \
  --host=https://workflow-energy.vercel.app \
  --users 200 \
  --spawn-rate 20 \
  --run-time 20m \
  --headless \
  --html=reports/locust-report-stress.html
```

## Interpretación de Resultados

### Métricas Clave

1. **RPS (Requests Per Second)**: Peticiones por segundo
2. **Response Time**: Tiempo de respuesta promedio, mediana, p95, p99
3. **Failure Rate**: Porcentaje de peticiones fallidas
4. **Number of Users**: Usuarios simultáneos

### Valores Esperados

- **Response Time < 500ms**: Excelente
- **Response Time < 1s**: Bueno
- **Response Time < 2s**: Aceptable
- **Response Time > 2s**: Requiere optimización

- **Failure Rate < 1%**: Excelente
- **Failure Rate < 5%**: Aceptable
- **Failure Rate > 5%**: Requiere atención

## Personalización

### Agregar Nuevas Tareas

Edita `tests/load/locustfile.py` y agrega nuevas tareas con el decorador `@task`:

```python
@task(1)  # El número indica el peso relativo
def mi_nueva_tarea(self):
    self.client.get("/mi-endpoint", name="/mi-endpoint")
```

### Cambiar Comportamiento de Usuarios

Modifica la clase `WorkflowEnergyUser` en `locustfile.py`:

```python
class WorkflowEnergyUser(HttpUser):
    wait_time = between(1, 5)  # Cambiar tiempo de espera
    weight = 3  # Cambiar peso relativo
```

## Reportes

Los reportes se generan en formato HTML en `reports/locust-report.html` cuando se ejecuta en modo headless.

## Integración con CI/CD

Ejemplo para GitHub Actions:

```yaml
- name: Run Load Tests
  run: |
    pip install -r requirements.txt
    locust -f tests/load/locustfile.py \
      --host=${{ secrets.BASE_URL }} \
      --users 10 \
      --spawn-rate 2 \
      --run-time 5m \
      --headless \
      --html=reports/locust-report.html
```

