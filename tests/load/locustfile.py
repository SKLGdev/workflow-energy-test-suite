"""
Locustfile para tests de carga de Workflow Energy
Ejecutar con: locust -f tests/load/locustfile.py --host=https://workflow-energy.vercel.app
"""

from locust import HttpUser, task, between, events
import os
import random
import string
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Utilidades para generar datos aleatorios
def generar_string_aleatorio(longitud=8):
    """Genera un string aleatorio de la longitud especificada"""
    caracteres = string.ascii_letters + string.digits
    return ''.join(random.choice(caracteres) for _ in range(longitud))

def generar_id_aleatorio(longitud=6):
    """Genera un ID numérico aleatorio"""
    return ''.join(str(random.randint(1, 9)) for _ in range(longitud))

class WorkflowEnergyUser(HttpUser):
    """
    Usuario simulado para tests de carga
    """
    wait_time = between(1, 3)  # Espera entre 1 y 3 segundos entre tareas
    
    def on_start(self):
        """
        Se ejecuta al inicio de cada usuario simulado
        Realiza login y guarda el token
        """
        self.token = None
        self.api_base = os.getenv("API_URL", "https://workflow-energy.onrender.com/api")
        self.created_work_orders = []  # Para limpiar después
        self.created_teams = []  # Para limpiar después
        
        # Intentar login
        email = os.getenv("ADMIN_USER", "admin@test.com")
        password = os.getenv("ADMIN_PASS", "password")
        
        try:
            response = self.client.post(
                f"{self.api_base}/auth/login",
                json={"email": email, "password": password},
                name="/auth/login"
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("accessToken")
                if self.token:
                    self.client.headers.update({"Authorization": f"Bearer {self.token}"})
        except Exception as e:
            print(f"Error en login: {e}")
    
    def on_stop(self):
        """Limpia recursos creados durante el test"""
        if self.token:
            # Limpiar work orders creados
            for wo_id in self.created_work_orders:
                try:
                    self.client.delete(
                        f"{self.api_base}/work-orders/{wo_id}",
                        headers={"Authorization": f"Bearer {self.token}"},
                        name="/api/work-orders/[id] DELETE"
                    )
                except:
                    pass
            
            # Limpiar teams creados
            for team_id in self.created_teams:
                try:
                    self.client.delete(
                        f"{self.api_base}/teams/{team_id}",
                        headers={"Authorization": f"Bearer {self.token}"},
                        name="/api/teams/[id] DELETE"
                    )
                except:
                    pass

    # ====== TAREAS DE LECTURA (GET) ======
    
    @task(5)
    def view_dashboard(self):
        """Ver dashboard - tarea más común"""
        self.client.get("/dashboard", name="/dashboard")

    @task(4)
    def view_work_orders(self):
        """Ver lista de órdenes de trabajo"""
        self.client.get("/work-orders", name="/work-orders")

    @task(4)
    def view_teams(self):
        """Ver lista de equipos"""
        self.client.get("/teams", name="/teams")

    @task(3)
    def api_get_work_orders(self):
        """Obtener órdenes de trabajo vía API"""
        if self.token:
            response = self.client.get(
                f"{self.api_base}/work-orders",
                name="/api/work-orders",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            # Validar respuesta
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Guardar IDs para operaciones posteriores
                    if isinstance(data, list) and len(data) > 0:
                        self.work_order_ids = [wo.get("id") for wo in data if wo.get("id")]
                    elif isinstance(data, dict) and "data" in data:
                        self.work_order_ids = [wo.get("id") for wo in data.get("data", []) if wo.get("id")]
                except:
                    pass

    @task(3)
    def api_get_teams(self):
        """Obtener equipos vía API"""
        if self.token:
            response = self.client.get(
                f"{self.api_base}/teams",
                name="/api/teams",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            # Validar respuesta
            if response.status_code == 200:
                try:
                    data = response.json()
                    # Guardar IDs para operaciones posteriores
                    if isinstance(data, list) and len(data) > 0:
                        self.team_ids = [team.get("id") for team in data if team.get("id")]
                    elif isinstance(data, dict) and "data" in data:
                        self.team_ids = [team.get("id") for team in data.get("data", []) if team.get("id")]
                except:
                    pass

    @task(3)
    def api_get_dashboard_stats(self):
        """Obtener estadísticas del dashboard vía API"""
        if self.token:
            self.client.get(
                f"{self.api_base}/dashboard/stats",
                name="/api/dashboard/stats",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(2)
    def api_get_work_order_by_id(self):
        """Obtener un work order específico por ID"""
        if self.token and hasattr(self, 'work_order_ids') and self.work_order_ids:
            work_order_id = random.choice(self.work_order_ids)
            self.client.get(
                f"{self.api_base}/work-orders/{work_order_id}",
                name="/api/work-orders/[id]",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(2)
    def api_get_team_by_id(self):
        """Obtener un equipo específico por ID"""
        if self.token and hasattr(self, 'team_ids') and self.team_ids:
            team_id = random.choice(self.team_ids)
            self.client.get(
                f"{self.api_base}/teams/{team_id}",
                name="/api/teams/[id]",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(2)
    def api_get_profile(self):
        """Obtener perfil del usuario autenticado"""
        if self.token:
            self.client.get(
                f"{self.api_base}/auth/me",
                name="/api/auth/profile",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(2)
    def api_get_work_orders_filtered_by_status(self):
        """Obtener work orders filtrados por estado"""
        if self.token:
            statuses = ["pending", "in_progress", "completed", "cancelled"]
            status = random.choice(statuses)
            self.client.get(
                f"{self.api_base}/work-orders?status={status}",
                name="/api/work-orders?status",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(2)
    def api_get_work_orders_filtered_by_priority(self):
        """Obtener work orders filtrados por prioridad"""
        if self.token:
            priorities = ["low", "medium", "high"]
            priority = random.choice(priorities)
            self.client.get(
                f"{self.api_base}/work-orders?priority={priority}",
                name="/api/work-orders?priority",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def view_auditoria(self):
        """Ver página de auditoría"""
        self.client.get("/access-logs", name="/access-logs")

    @task(1)
    def api_get_access_logs(self):
        """Obtener logs de acceso vía API"""
        if self.token:
            self.client.get(
                f"{self.api_base}/access-logs",
                name="/api/access-logs",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def view_profile(self):
        """Ver perfil de usuario"""
        self.client.get("/profile", name="/profile")

    # ====== TAREAS DE ESCRITURA (POST/PUT/DELETE) ======
    
    @task(2)
    def api_create_work_order(self):
        """Crear un nuevo work order"""
        if self.token:
            work_order_data = {
                "title": f"Orden de Carga {generar_string_aleatorio(8)}",
                "description": f"Descripción generada automáticamente {generar_string_aleatorio(6)}",
                "priority": random.choice(["low", "medium", "high"]),
                "estimated_hours": random.randint(1, 8),
                "location": f"Ubicación {generar_string_aleatorio(10)}"
            }
            
            response = self.client.post(
                f"{self.api_base}/work-orders",
                json=work_order_data,
                name="/api/work-orders POST",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            # Guardar ID para limpieza
            if response.status_code in [200, 201]:
                try:
                    data = response.json()
                    wo_data = data.get("workOrder") or data
                    if wo_data and wo_data.get("id"):
                        self.created_work_orders.append(wo_data["id"])
                except:
                    pass

    @task(1)
    def api_create_team(self):
        """Crear un nuevo equipo"""
        if self.token:
            team_data = {
                "name": f"Equipo de Carga {generar_string_aleatorio(8)}",
                "description": f"Descripción del equipo {generar_string_aleatorio(6)}"
            }
            
            response = self.client.post(
                f"{self.api_base}/teams",
                json=team_data,
                name="/api/teams POST",
                headers={"Authorization": f"Bearer {self.token}"}
            )
            
            # Guardar ID para limpieza
            if response.status_code in [200, 201]:
                try:
                    data = response.json()
                    team_data = data.get("team") or data
                    if team_data and team_data.get("id"):
                        self.created_teams.append(team_data["id"])
                except:
                    pass

    @task(1)
    def api_update_work_order(self):
        """Actualizar un work order existente"""
        if self.token and hasattr(self, 'work_order_ids') and self.work_order_ids:
            work_order_id = random.choice(self.work_order_ids)
            update_data = {
                "title": f"Orden Actualizada {generar_string_aleatorio(6)}",
                "priority": random.choice(["low", "medium", "high"])
            }
            
            self.client.put(
                f"{self.api_base}/work-orders/{work_order_id}",
                json=update_data,
                name="/api/work-orders/[id] PUT",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def api_update_team(self):
        """Actualizar un equipo existente"""
        if self.token and hasattr(self, 'team_ids') and self.team_ids:
            team_id = random.choice(self.team_ids)
            update_data = {
                "name": f"Equipo Actualizado {generar_string_aleatorio(6)}",
                "description": f"Nueva descripción {generar_string_aleatorio(8)}"
            }
            
            self.client.put(
                f"{self.api_base}/teams/{team_id}",
                json=update_data,
                name="/api/teams/[id] PUT",
                headers={"Authorization": f"Bearer {self.token}"}
            )


class UnauthenticatedUser(HttpUser):
    """
    Usuario no autenticado para tests de carga en endpoints públicos
    """
    wait_time = between(1, 2)
    weight = 1  # Menor peso que usuarios autenticados

    @task(3)
    def view_login_page(self):
        """Ver página de login"""
        self.client.get("/login", name="/login")

    @task(1)
    def attempt_login_with_invalid_credentials(self):
        """Intentar login con credenciales inválidas (simula ataques)"""
        api_base = os.getenv("API_URL", "https://workflow-energy.onrender.com/api")
        invalid_data = {
            "email": f"invalid_{generar_string_aleatorio(8)}@test.com",
            "password": generar_string_aleatorio(12)
        }
        self.client.post(
            f"{api_base}/auth/login",
            json=invalid_data,
            name="/auth/login (invalid)",
            catch_response=True
        )


class SupervisorUser(HttpUser):
    """
    Usuario supervisor con permisos limitados
    """
    wait_time = between(1, 3)
    weight = 1  # Menos usuarios que admin

    def on_start(self):
        """Login como supervisor"""
        self.token = None
        self.api_base = os.getenv("API_URL", "https://workflow-energy.onrender.com/api")
        
        email = os.getenv("SUPERVISOR_USER", os.getenv("ADMIN_USER", "supervisor@test.com"))
        password = os.getenv("SUPERVISOR_PASS", os.getenv("ADMIN_PASS", "password"))
        
        try:
            response = self.client.post(
                f"{self.api_base}/auth/login",
                json={"email": email, "password": password},
                name="/auth/login (supervisor)"
            )
            if response.status_code == 200:
                data = response.json()
                self.token = data.get("accessToken")
                if self.token:
                    self.client.headers.update({"Authorization": f"Bearer {self.token}"})
        except Exception as e:
            print(f"Error en login supervisor: {e}")

    @task(3)
    def view_dashboard(self):
        """Ver dashboard"""
        self.client.get("/dashboard", name="/dashboard (supervisor)")

    @task(2)
    def api_get_work_orders(self):
        """Obtener work orders (solo lectura)"""
        if self.token:
            self.client.get(
                f"{self.api_base}/work-orders",
                name="/api/work-orders (supervisor)",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def api_get_profile(self):
        """Obtener perfil"""
        if self.token:
            self.client.get(
                f"{self.api_base}/auth/me",
                name="/api/auth/profile (supervisor)",
                headers={"Authorization": f"Bearer {self.token}"}
            )


# Eventos para métricas personalizadas
@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    """Registra métricas personalizadas"""
    if exception:
        # Aquí podrías agregar lógica para registrar errores específicos
        pass

