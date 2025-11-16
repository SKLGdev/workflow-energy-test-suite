"""
Locustfile para tests de carga de Workflow Energy
Ejecutar con: locust -f tests/load/locustfile.py --host=https://workflow-energy.vercel.app
"""

from locust import HttpUser, task, between
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

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
        
        # Intentar login (opcional, dependiendo de si necesitas autenticación)
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
                self.client.headers.update({"Authorization": f"Bearer {self.token}"})
        except Exception as e:
            print(f"Error en login: {e}")

    @task(3)
    def view_dashboard(self):
        """Ver dashboard - tarea más común"""
        self.client.get("/dashboard", name="/dashboard")

    @task(2)
    def view_work_orders(self):
        """Ver lista de órdenes de trabajo"""
        self.client.get("/work-orders", name="/work-orders")

    @task(2)
    def view_teams(self):
        """Ver lista de equipos"""
        self.client.get("/teams", name="/teams")

    @task(1)
    def view_auditoria(self):
        """Ver página de auditoría"""
        self.client.get("/access-logs", name="/access-logs")

    @task(1)
    def view_profile(self):
        """Ver perfil de usuario"""
        self.client.get("/profile", name="/profile")

    @task(1)
    def api_get_work_orders(self):
        """Obtener órdenes de trabajo vía API"""
        if self.token:
            self.client.get(
                f"{self.api_base}/work-orders",
                name="/api/work-orders",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def api_get_teams(self):
        """Obtener equipos vía API"""
        if self.token:
            self.client.get(
                f"{self.api_base}/teams",
                name="/api/teams",
                headers={"Authorization": f"Bearer {self.token}"}
            )

    @task(1)
    def api_get_dashboard_stats(self):
        """Obtener estadísticas del dashboard vía API"""
        if self.token:
            self.client.get(
                f"{self.api_base}/dashboard/stats",
                name="/api/dashboard/stats",
                headers={"Authorization": f"Bearer {self.token}"}
            )


class UnauthenticatedUser(HttpUser):
    """
    Usuario no autenticado para tests de carga en endpoints públicos
    """
    wait_time = between(1, 2)
    weight = 1  # Menor peso que usuarios autenticados

    @task(1)
    def view_login_page(self):
        """Ver página de login"""
        self.client.get("/login", name="/login")

